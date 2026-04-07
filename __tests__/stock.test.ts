import { describe, it, expect } from "vitest";

// Replica computeStatusFromVariants de ProductForm
function computeStatusFromVariants(variantStock: Record<string, number>): string {
  const values = Object.values(variantStock);
  if (values.length === 0) return "out-of-stock";
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return "out-of-stock";
  if (total <= 5) return "low-stock";
  return "available";
}

// Replica getStockForSize de SizeSelector
function getStockForSize(
  size: string,
  variantStock: Record<string, number> | undefined,
  selectedColor: string | undefined,
  multiColor: boolean
): number | undefined {
  if (!variantStock) return undefined;
  if (multiColor && selectedColor) return variantStock[`${size}:${selectedColor}`];
  if (multiColor && !selectedColor) {
    const keys = Object.keys(variantStock).filter((k) => k.startsWith(`${size}:`));
    if (keys.length === 0) return undefined;
    return keys.reduce((sum, k) => sum + (variantStock[k] ?? 0), 0);
  }
  return variantStock[size];
}

describe("computeStatusFromVariants", () => {
  it("sin variantes → out-of-stock", () => {
    expect(computeStatusFromVariants({})).toBe("out-of-stock");
  });
  it("todas las variantes en 0 → out-of-stock", () => {
    expect(computeStatusFromVariants({ M: 0, L: 0 })).toBe("out-of-stock");
  });
  it("total ≤ 5 → low-stock", () => {
    expect(computeStatusFromVariants({ M: 2, L: 3 })).toBe("low-stock");
    expect(computeStatusFromVariants({ M: 1 })).toBe("low-stock");
    expect(computeStatusFromVariants({ M: 5 })).toBe("low-stock");
  });
  it("total > 5 → available", () => {
    expect(computeStatusFromVariants({ M: 3, L: 3 })).toBe("available");
    expect(computeStatusFromVariants({ M: 10 })).toBe("available");
  });
  it("variantes mixtas (algunas en 0)", () => {
    expect(computeStatusFromVariants({ M: 0, L: 10 })).toBe("available");
    expect(computeStatusFromVariants({ M: 0, L: 3 })).toBe("low-stock");
  });
  it("producto multicolor — total por colores", () => {
    expect(computeStatusFromVariants({ "M:black-ops": 3, "M:od-green": 10 })).toBe("available");
    expect(computeStatusFromVariants({ "M:black-ops": 2, "M:od-green": 2 })).toBe("low-stock");
  });
});

describe("getStockForSize", () => {
  it("sin variantStock → undefined", () => {
    expect(getStockForSize("M", undefined, undefined, false)).toBeUndefined();
  });
  it("producto sin colores — retorna stock de la talla", () => {
    expect(getStockForSize("M", { M: 10, L: 5 }, undefined, false)).toBe(10);
  });
  it("producto sin colores — talla sin stock → undefined", () => {
    expect(getStockForSize("XL", { M: 10 }, undefined, false)).toBeUndefined();
  });
  it("multicolor con color seleccionado — retorna stock exacto", () => {
    const stock = { "M:black-ops": 4, "M:od-green": 8 };
    expect(getStockForSize("M", stock, "black-ops", true)).toBe(4);
    expect(getStockForSize("M", stock, "od-green", true)).toBe(8);
  });
  it("multicolor sin color — suma todos los colores de esa talla", () => {
    const stock = { "M:black-ops": 4, "M:od-green": 8, "L:black-ops": 2 };
    expect(getStockForSize("M", stock, undefined, true)).toBe(12);
    expect(getStockForSize("L", stock, undefined, true)).toBe(2);
  });
  it("multicolor sin color — talla sin ningún color → undefined", () => {
    const stock = { "M:black-ops": 4 };
    expect(getStockForSize("XL", stock, undefined, true)).toBeUndefined();
  });
  it("talla numérica funciona igual", () => {
    expect(getStockForSize("32", { "32": 15, "34": 8 }, undefined, false)).toBe(15);
    expect(getStockForSize("42", { "40:od-green": 5, "42:od-green": 3 }, "od-green", true)).toBe(3);
  });
});
