import { describe, it, expect } from "vitest";
import { validateOrder, validateProduct, validateAuth } from "@/lib/validation";

// ─── validateAuth ─────────────────────────────────────────────────────────────

describe("validateAuth", () => {
  it("pasa con contraseña válida", () => {
    expect(validateAuth({ password: "abc123" }).ok).toBe(true);
  });
  it("falla con contraseña vacía", () => {
    expect(validateAuth({ password: "" }).ok).toBe(false);
  });
  it("falla sin campo password", () => {
    expect(validateAuth({}).ok).toBe(false);
  });
  it("falla si el body no es objeto", () => {
    expect(validateAuth("hola").ok).toBe(false);
    expect(validateAuth(null).ok).toBe(false);
  });
});

// ─── validateProduct ──────────────────────────────────────────────────────────

const validProduct = {
  name: "Chaqueta Táctica",
  slug: "chaqueta-tactica",
  sku: "BF-001",
  series: "BELLO-01",
  category: "superior",
  price: 250000,
  rating: 5,
  reviewCount: 0,
  status: "available",
  images: [{ src: "/img.jpg", alt: "img", label: "frente" }],
  specs: [],
  availableSizes: ["M", "L"],
  availableColors: ["black-ops"],
  featured: false,
};

describe("validateProduct", () => {
  it("pasa con datos válidos", () => {
    expect(validateProduct(validProduct).ok).toBe(true);
  });
  it("falla con nombre muy corto", () => {
    expect(validateProduct({ ...validProduct, name: "A" }).ok).toBe(false);
  });
  it("falla con slug inválido (mayúsculas)", () => {
    expect(validateProduct({ ...validProduct, slug: "Chaqueta-Tactica" }).ok).toBe(false);
  });
  it("falla con slug inválido (espacios)", () => {
    expect(validateProduct({ ...validProduct, slug: "chaqueta tactica" }).ok).toBe(false);
  });
  it("falla con precio cero", () => {
    expect(validateProduct({ ...validProduct, price: 0 }).ok).toBe(false);
  });
  it("falla con precio negativo", () => {
    expect(validateProduct({ ...validProduct, price: -100 }).ok).toBe(false);
  });
  it("falla con categoría inválida", () => {
    expect(validateProduct({ ...validProduct, category: "jackets" }).ok).toBe(false);
  });
  it("acepta todas las categorías válidas", () => {
    for (const cat of ["superior", "inferior", "calzado", "accessories"]) {
      expect(validateProduct({ ...validProduct, category: cat }).ok).toBe(true);
    }
  });
  it("falla con status inválido", () => {
    expect(validateProduct({ ...validProduct, status: "soldout" }).ok).toBe(false);
  });
  it("falla sin imágenes (no array)", () => {
    expect(validateProduct({ ...validProduct, images: "una imagen" }).ok).toBe(false);
  });
  it("falla si featured no es booleano", () => {
    expect(validateProduct({ ...validProduct, featured: "si" }).ok).toBe(false);
  });
});

// ─── validateOrder ────────────────────────────────────────────────────────────

const validOrder = {
  customer: {
    name: "Juan García",
    phone: "3001234567",
    address: "Calle 50 # 30-10",
    city: "Bello",
  },
  items: [
    {
      productId: "abc123",
      name: "Camiseta Táctica",
      sku: "BF-001",
      price: 89900,
      image: "/img.jpg",
      selectedSize: "M",
      quantity: 2,
    },
  ],
  subtotal: 179800,
  tax: 34162,
  total: 213962,
};

describe("validateOrder", () => {
  it("pasa con datos válidos", () => {
    expect(validateOrder(validOrder).ok).toBe(true);
  });

  // Tallas flexibles — bug que fue corregido
  it("acepta talla numérica (pantalón 32)", () => {
    const order = { ...validOrder, items: [{ ...validOrder.items[0], selectedSize: "32" }] };
    expect(validateOrder(order).ok).toBe(true);
  });
  it("acepta talla de calzado (42)", () => {
    const order = { ...validOrder, items: [{ ...validOrder.items[0], selectedSize: "42" }] };
    expect(validateOrder(order).ok).toBe(true);
  });
  it("acepta talla ÚNICA", () => {
    const order = { ...validOrder, items: [{ ...validOrder.items[0], selectedSize: "ÚNICA" }] };
    expect(validateOrder(order).ok).toBe(true);
  });
  it("rechaza talla vacía", () => {
    const order = { ...validOrder, items: [{ ...validOrder.items[0], selectedSize: "" }] };
    expect(validateOrder(order).ok).toBe(false);
  });

  it("falla con nombre de cliente muy corto", () => {
    expect(validateOrder({ ...validOrder, customer: { ...validOrder.customer, name: "J" } }).ok).toBe(false);
  });
  it("falla con teléfono inválido", () => {
    expect(validateOrder({ ...validOrder, customer: { ...validOrder.customer, phone: "123" } }).ok).toBe(false);
  });
  it("falla con email mal formado", () => {
    expect(validateOrder({ ...validOrder, customer: { ...validOrder.customer, email: "no-es-email" } }).ok).toBe(false);
  });
  it("acepta email válido", () => {
    expect(validateOrder({ ...validOrder, customer: { ...validOrder.customer, email: "juan@mail.com" } }).ok).toBe(true);
  });
  it("acepta sin email (es opcional)", () => {
    expect(validateOrder({ ...validOrder, customer: { ...validOrder.customer, email: undefined } }).ok).toBe(true);
  });
  it("falla con items vacíos", () => {
    expect(validateOrder({ ...validOrder, items: [] }).ok).toBe(false);
  });
  it("falla con cantidad cero", () => {
    const order = { ...validOrder, items: [{ ...validOrder.items[0], quantity: 0 }] };
    expect(validateOrder(order).ok).toBe(false);
  });
  it("falla con precio cero en item", () => {
    const order = { ...validOrder, items: [{ ...validOrder.items[0], price: 0 }] };
    expect(validateOrder(order).ok).toBe(false);
  });
  it("falla con total cero", () => {
    expect(validateOrder({ ...validOrder, total: 0 }).ok).toBe(false);
  });
});
