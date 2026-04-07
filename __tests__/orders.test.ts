import { describe, it, expect } from "vitest";

// ─── Funciones puras extraídas de la lógica del API de pedidos ───────────────

/**
 * Resuelve la clave real en size_stock a partir de la clave que envía el cliente.
 * El cliente siempre puede enviar "TALLA:COLOR", pero si el producto tiene
 * 1 solo color, el stock está guardado como "TALLA" (sin color).
 */
function resolveVariantKey(clientKey: string, isMultiColor: boolean): string {
  return !isMultiColor && clientKey.includes(":") ? clientKey.split(":")[0] : clientKey;
}

/**
 * Decrementa stock y devuelve el nuevo mapa + error si no hay suficiente.
 * Réplica exacta de la lógica en app/api/orders/route.ts
 */
function decrementStock(
  currentStock: Record<string, number>,
  variants: Map<string, number>,
  isMultiColor: boolean
): { newStock: Record<string, number>; error: string | null } {
  const newStock = { ...currentStock };
  for (const [clientKey, qty] of variants) {
    const key = resolveVariantKey(clientKey, isMultiColor);
    const available = currentStock[key] ?? 0;
    if (available < qty) {
      return {
        newStock,
        error: `Stock insuficiente: talla ${key.split(":")[0]} — solo quedan ${available} ${available === 1 ? "unidad" : "unidades"}`,
      };
    }
    newStock[key] = available - qty;
  }
  return { newStock, error: null };
}

/**
 * Restaura stock al cancelar un pedido.
 * Réplica exacta de la lógica en app/api/admin/orders/[id]/route.ts
 */
function restoreStock(
  currentStock: Record<string, number>,
  variants: Map<string, number>,
  isMultiColor: boolean
): Record<string, number> {
  const newStock = { ...currentStock };
  for (const [clientKey, qty] of variants) {
    const key = resolveVariantKey(clientKey, isMultiColor);
    newStock[key] = (newStock[key] ?? 0) + qty;
  }
  return newStock;
}

function computeStatus(stock: Record<string, number>): string {
  const total = Object.values(stock).reduce((a, b) => a + b, 0);
  if (total === 0) return "out-of-stock";
  if (total <= 5) return "low-stock";
  return "available";
}

// ─── Migración de claves al cambiar número de colores (lógica de toggleColor) ─

function migrateVariantStock(
  variantStock: Record<string, number>,
  prevColors: string[],
  newColors: string[],
  toggledColor: string
): Record<string, number> {
  const wasMulti = prevColors.length > 1;
  const isMulti = newColors.length > 1;
  const isRemoving = prevColors.includes(toggledColor);
  const result = { ...variantStock };

  if (!wasMulti && isMulti) {
    // 1 → 2+ colores: "TALLA" → "TALLA:colorAnterior" y nuevo color en 0
    const existingColor = prevColors[0];
    const migrated: Record<string, number> = {};
    Object.entries(result).forEach(([k, v]) => {
      migrated[k.includes(":") ? k : `${k}:${existingColor}`] = v;
    });
    // Las tallas activas del nuevo color parten en 0
    // (simulamos que availableSizes son las claves sin color)
    Object.keys(variantStock).forEach((k) => {
      if (!k.includes(":")) migrated[`${k}:${toggledColor}`] = 0;
    });
    return migrated;
  }

  if (wasMulti && !isMulti) {
    // 2 → 1 color: conservar solo el color que queda, renombrar a "TALLA"
    const remainingColor = newColors[0];
    const migrated: Record<string, number> = {};
    Object.entries(result).forEach(([k, v]) => {
      if (k.includes(":")) {
        const [size, color] = k.split(":");
        if (color === remainingColor) migrated[size] = v;
      } else {
        migrated[k] = v;
      }
    });
    return migrated;
  }

  if (wasMulti && isMulti) {
    if (!isRemoving) {
      // Añadir color en modo multicolor: clave en 0 por cada talla existente
      const sizes = new Set(Object.keys(result).map((k) => k.split(":")[0]));
      sizes.forEach((size) => { result[`${size}:${toggledColor}`] = 0; });
    } else {
      // Quitar color en modo multicolor: eliminar sus claves
      Object.keys(result).forEach((k) => {
        if (k.endsWith(`:${toggledColor}`)) delete result[k];
      });
    }
    return result;
  }

  return result;
}

// ─── Tests: resolución de clave de variante ───────────────────────────────────

describe("resolveVariantKey", () => {
  it("producto un color: clave 'TALLA:COLOR' → 'TALLA'", () => {
    expect(resolveVariantKey("M:black-ops", false)).toBe("M");
    expect(resolveVariantKey("32:od-green", false)).toBe("32");
  });

  it("producto un color: clave 'TALLA' se conserva intacta", () => {
    expect(resolveVariantKey("M", false)).toBe("M");
  });

  it("producto multicolor: clave 'TALLA:COLOR' se conserva intacta", () => {
    expect(resolveVariantKey("M:black-ops", true)).toBe("M:black-ops");
    expect(resolveVariantKey("L:od-green", true)).toBe("L:od-green");
  });

  it("producto multicolor: clave 'TALLA' sola se conserva intacta", () => {
    expect(resolveVariantKey("M", true)).toBe("M");
  });

  it("tallas numéricas funcionan igual", () => {
    expect(resolveVariantKey("32:black-ops", false)).toBe("32");
    expect(resolveVariantKey("42:od-green", true)).toBe("42:od-green");
  });
});

// ─── Tests: decremento de stock ───────────────────────────────────────────────

describe("decrementStock — producto un color", () => {
  const stock = { M: 10, L: 5, XL: 2 };

  it("decrementa correctamente con clave 'TALLA'", () => {
    const variants = new Map([["M", 3]]);
    const { newStock, error } = decrementStock(stock, variants, false);
    expect(error).toBeNull();
    expect(newStock.M).toBe(7);
    expect(newStock.L).toBe(5);
  });

  it("decrementa correctamente cuando cliente envía 'TALLA:COLOR' (bug corregido)", () => {
    const variants = new Map([["M:black-ops", 4]]);
    const { newStock, error } = decrementStock(stock, variants, false);
    expect(error).toBeNull();
    expect(newStock.M).toBe(6); // resolvió "M:black-ops" → "M"
  });

  it("error cuando stock insuficiente", () => {
    const variants = new Map([["XL", 5]]);
    const { error } = decrementStock(stock, variants, false);
    expect(error).not.toBeNull();
    expect(error).toContain("XL");
    expect(error).toContain("2");
  });

  it("error cuando stock es 0", () => {
    const variants = new Map([["M", 1]]);
    const { error } = decrementStock({ M: 0 }, variants, false);
    expect(error).not.toBeNull();
    expect(error).toContain("0 unidades");
  });

  it("decremento hasta 0 no da error", () => {
    const variants = new Map([["L", 5]]);
    const { newStock, error } = decrementStock(stock, variants, false);
    expect(error).toBeNull();
    expect(newStock.L).toBe(0);
  });

  it("múltiples tallas en un pedido", () => {
    const variants = new Map([["M", 2], ["L", 2]]);
    const { newStock, error } = decrementStock(stock, variants, false);
    expect(error).toBeNull();
    expect(newStock.M).toBe(8);
    expect(newStock.L).toBe(3);
  });
});

describe("decrementStock — producto multicolor", () => {
  const stock = { "M:black-ops": 8, "M:od-green": 4, "L:black-ops": 6, "L:od-green": 0 };

  it("decrementa la variante correcta", () => {
    const variants = new Map([["M:black-ops", 3]]);
    const { newStock, error } = decrementStock(stock, variants, true);
    expect(error).toBeNull();
    expect(newStock["M:black-ops"]).toBe(5);
    expect(newStock["M:od-green"]).toBe(4); // intacto
  });

  it("error cuando variante específica agotada", () => {
    const variants = new Map([["L:od-green", 1]]);
    const { error } = decrementStock(stock, variants, true);
    expect(error).not.toBeNull();
    expect(error).toContain("L");
  });

  it("variante inexistente se trata como 0", () => {
    const variants = new Map([["XL:black-ops", 1]]);
    const { error } = decrementStock(stock, variants, true);
    expect(error).not.toBeNull();
  });

  it("múltiples variantes en un pedido", () => {
    const variants = new Map([["M:black-ops", 2], ["M:od-green", 2]]);
    const { newStock, error } = decrementStock(stock, variants, true);
    expect(error).toBeNull();
    expect(newStock["M:black-ops"]).toBe(6);
    expect(newStock["M:od-green"]).toBe(2);
  });
});

// ─── Tests: restauración de stock al cancelar ─────────────────────────────────

describe("restoreStock — producto un color", () => {
  it("restaura unidades al cancelar", () => {
    const current = { M: 3, L: 0 };
    const variants = new Map([["M", 2]]);
    const restored = restoreStock(current, variants, false);
    expect(restored.M).toBe(5);
    expect(restored.L).toBe(0);
  });

  it("restaura desde clave 'TALLA:COLOR' aunque es un solo color (bug corregido)", () => {
    const current = { M: 3 };
    const variants = new Map([["M:black-ops", 5]]);
    const restored = restoreStock(current, variants, false);
    expect(restored.M).toBe(8); // resolvió "M:black-ops" → "M"
  });

  it("restaura talla que quedó en 0 (reabastece)", () => {
    const current = { M: 0, L: 10 };
    const variants = new Map([["M", 3]]);
    const restored = restoreStock(current, variants, false);
    expect(restored.M).toBe(3);
    expect(restored.L).toBe(10);
  });

  it("restaurar producto que fue eliminado del stock", () => {
    const current = {};
    const variants = new Map([["M", 2]]);
    const restored = restoreStock(current as Record<string, number>, variants, false);
    expect(restored.M).toBe(2);
  });

  it("restauración múltiples tallas", () => {
    const current = { M: 1, L: 0, XL: 4 };
    const variants = new Map([["M", 3], ["L", 5], ["XL", 2]]);
    const restored = restoreStock(current, variants, false);
    expect(restored.M).toBe(4);
    expect(restored.L).toBe(5);
    expect(restored.XL).toBe(6);
  });
});

describe("restoreStock — producto multicolor", () => {
  it("restaura la variante exacta", () => {
    const current = { "M:black-ops": 2, "M:od-green": 8, "L:black-ops": 0 };
    const variants = new Map([["L:black-ops", 4]]);
    const restored = restoreStock(current, variants, true);
    expect(restored["L:black-ops"]).toBe(4);
    expect(restored["M:black-ops"]).toBe(2); // intacto
  });

  it("restaura múltiples variantes de distintos colores", () => {
    const current = { "M:black-ops": 3, "M:od-green": 1 };
    const variants = new Map([["M:black-ops", 2], ["M:od-green", 3]]);
    const restored = restoreStock(current, variants, true);
    expect(restored["M:black-ops"]).toBe(5);
    expect(restored["M:od-green"]).toBe(4);
  });
});

// ─── Tests: estado después de cambio de stock ─────────────────────────────────

describe("computeStatus tras decremento/restauración", () => {
  it("pedido completa stock → out-of-stock", () => {
    const { newStock } = decrementStock({ M: 2, L: 3 }, new Map([["M", 2], ["L", 3]]), false);
    expect(computeStatus(newStock)).toBe("out-of-stock");
  });

  it("pedido deja pocas unidades → low-stock", () => {
    const { newStock } = decrementStock({ M: 10, L: 8 }, new Map([["M", 8], ["L", 7]]), false);
    expect(computeStatus(newStock)).toBe("low-stock"); // total = 3
  });

  it("cancelación sobre agotado → vuelve a available", () => {
    const restored = restoreStock({ M: 0 }, new Map([["M", 10]]), false);
    expect(computeStatus(restored)).toBe("available");
  });

  it("cancelación parcial → low-stock", () => {
    const restored = restoreStock({ M: 0, L: 2 }, new Map([["M", 3]]), false);
    expect(computeStatus(restored)).toBe("low-stock"); // total = 5
  });

  it("cancelación que deja stock > 5 → available", () => {
    const restored = restoreStock({ M: 0, L: 3 }, new Map([["M", 10]]), false);
    expect(computeStatus(restored)).toBe("available"); // total = 13
  });
});

// ─── Tests: migración de variantStock al cambiar colores ──────────────────────

describe("migrateVariantStock — toggleColor", () => {
  it("1 → 2 colores: convierte 'TALLA' → 'TALLA:colorExistente' y añade nuevo en 0", () => {
    const initial = { M: 10, L: 5 };
    const result = migrateVariantStock(initial, ["black-ops"], ["black-ops", "od-green"], "od-green");
    // El color existente conserva su stock
    expect(result["M:black-ops"]).toBe(10);
    expect(result["L:black-ops"]).toBe(5);
    // El nuevo color arranca en 0
    expect(result["M:od-green"]).toBe(0);
    expect(result["L:od-green"]).toBe(0);
    // Las claves viejas no existen
    expect(result["M"]).toBeUndefined();
    expect(result["L"]).toBeUndefined();
  });

  it("2 → 1 color: conserva solo el stock del color que queda renombrado a 'TALLA'", () => {
    const initial = { "M:black-ops": 10, "M:od-green": 4, "L:black-ops": 5, "L:od-green": 2 };
    const result = migrateVariantStock(
      initial,
      ["black-ops", "od-green"],
      ["black-ops"],
      "od-green"
    );
    expect(result["M"]).toBe(10);
    expect(result["L"]).toBe(5);
    // El color eliminado no aparece
    expect(result["M:od-green"]).toBeUndefined();
    expect(result["L:od-green"]).toBeUndefined();
    expect(result["M:black-ops"]).toBeUndefined();
  });

  it("2 → 1 color: el stock del color eliminado se descarta (no se suma)", () => {
    const initial = { "M:black-ops": 10, "M:od-green": 99 };
    const result = migrateVariantStock(
      initial,
      ["black-ops", "od-green"],
      ["od-green"],
      "black-ops"
    );
    expect(result["M"]).toBe(99); // solo queda od-green
  });

  it("multicolor: añadir 3er color inicializa en 0 todas las tallas", () => {
    const initial = { "M:black-ops": 10, "M:od-green": 5, "L:black-ops": 8, "L:od-green": 3 };
    const result = migrateVariantStock(
      initial,
      ["black-ops", "od-green"],
      ["black-ops", "od-green", "navy"],
      "navy"
    );
    expect(result["M:navy"]).toBe(0);
    expect(result["L:navy"]).toBe(0);
    // Los existentes no cambian
    expect(result["M:black-ops"]).toBe(10);
    expect(result["L:od-green"]).toBe(3);
  });

  it("2 → 1 color: el color eliminado desaparece y el que queda se renombra a 'TALLA'", () => {
    const initial = { "M:black-ops": 10, "M:od-green": 5, "L:black-ops": 8, "L:od-green": 3 };
    const result = migrateVariantStock(
      initial,
      ["black-ops", "od-green"],
      ["black-ops"],
      "od-green"
    );
    // od-green desaparece
    expect(result["M:od-green"]).toBeUndefined();
    expect(result["L:od-green"]).toBeUndefined();
    // black-ops se renombra a "TALLA" (sin color en la clave)
    expect(result["M"]).toBe(10);
    expect(result["L"]).toBe(8);
    expect(result["M:black-ops"]).toBeUndefined();
  });

  it("3 → 2 colores: eliminar uno en modo multicolor borra solo sus claves", () => {
    const initial = {
      "M:black-ops": 10, "M:od-green": 5, "M:navy": 3,
      "L:black-ops": 8,  "L:od-green": 4, "L:navy": 2,
    };
    const result = migrateVariantStock(
      initial,
      ["black-ops", "od-green", "navy"],
      ["black-ops", "od-green"],
      "navy"
    );
    // navy desaparece
    expect(result["M:navy"]).toBeUndefined();
    expect(result["L:navy"]).toBeUndefined();
    // los demás se conservan intactos con sus claves "TALLA:COLOR"
    expect(result["M:black-ops"]).toBe(10);
    expect(result["M:od-green"]).toBe(5);
    expect(result["L:black-ops"]).toBe(8);
    expect(result["L:od-green"]).toBe(4);
  });

  it("stock en 0 se migra correctamente (no desaparece)", () => {
    const initial = { M: 0, L: 5 };
    const result = migrateVariantStock(initial, ["black-ops"], ["black-ops", "od-green"], "od-green");
    expect(result["M:black-ops"]).toBe(0);
    expect(result["L:black-ops"]).toBe(5);
  });
});

// ─── Tests: flujo completo pedido → cancelación → stock restaurado ─────────────

describe("flujo completo: pedido + cancelación", () => {
  it("stock original = después de pedir + cancelar", () => {
    const original = { M: 10, L: 8, XL: 3 };
    const variants = new Map([["M", 3], ["L", 2]]);

    const { newStock: afterOrder } = decrementStock(original, variants, false);
    expect(afterOrder.M).toBe(7);
    expect(afterOrder.L).toBe(6);

    const afterCancel = restoreStock(afterOrder, variants, false);
    expect(afterCancel.M).toBe(original.M);
    expect(afterCancel.L).toBe(original.L);
    expect(afterCancel.XL).toBe(original.XL);
  });

  it("flujo multicolor: pedido + cancelación restaura exacto", () => {
    const original = { "M:black-ops": 8, "M:od-green": 6, "L:black-ops": 4 };
    const variants = new Map([["M:black-ops", 3], ["L:black-ops", 4]]);

    const { newStock: afterOrder, error } = decrementStock(original, variants, true);
    expect(error).toBeNull();
    expect(afterOrder["M:black-ops"]).toBe(5);
    expect(afterOrder["L:black-ops"]).toBe(0);

    const afterCancel = restoreStock(afterOrder, variants, true);
    expect(afterCancel["M:black-ops"]).toBe(original["M:black-ops"]);
    expect(afterCancel["L:black-ops"]).toBe(original["L:black-ops"]);
    expect(afterCancel["M:od-green"]).toBe(original["M:od-green"]); // intacto
  });

  it("cancelar pedido en producto de 1 color con clave enviada como 'TALLA:COLOR'", () => {
    const original = { M: 10 };
    // El cliente envió selectedColor, así que la clave en la orden es "M:black-ops"
    const variants = new Map([["M:black-ops", 3]]);

    const { newStock: afterOrder, error } = decrementStock(original, variants, false);
    expect(error).toBeNull();
    expect(afterOrder.M).toBe(7);

    const afterCancel = restoreStock(afterOrder, variants, false);
    expect(afterCancel.M).toBe(10);
  });
});
