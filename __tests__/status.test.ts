import { describe, it, expect } from "vitest";
import { effectiveStatus } from "@/lib/status";
import type { Product } from "@/lib/types";

const base: Product = {
  id: "1",
  slug: "test",
  sku: "T-001",
  series: "TEST",
  name: "Producto Test",
  category: "superior",
  price: 100000,
  rating: 5,
  reviewCount: 0,
  status: "available",
  images: [{ src: "/img.jpg", alt: "img", label: "frente" }],
  specs: [],
  availableSizes: [],
  availableColors: [],
  featured: false,
};

describe("effectiveStatus", () => {
  it("devuelve el status de la BD si no hay tallas configuradas", () => {
    expect(effectiveStatus({ ...base, availableSizes: [], variantStock: undefined })).toBe("available");
  });

  it("devuelve out-of-stock si hay tallas pero sin variantStock", () => {
    expect(effectiveStatus({ ...base, availableSizes: ["M"], variantStock: undefined })).toBe("out-of-stock");
  });

  it("devuelve el status de la BD si hay tallas Y variantStock", () => {
    expect(effectiveStatus({ ...base, availableSizes: ["M"], variantStock: { M: 5 }, status: "available" })).toBe("available");
    expect(effectiveStatus({ ...base, availableSizes: ["M"], variantStock: { M: 2 }, status: "low-stock" })).toBe("low-stock");
    expect(effectiveStatus({ ...base, availableSizes: ["M"], variantStock: { M: 0 }, status: "out-of-stock" })).toBe("out-of-stock");
  });

  it("productos sin tallas (accesorios sin talla) usan status de la BD", () => {
    expect(effectiveStatus({ ...base, availableSizes: [], status: "out-of-stock" })).toBe("out-of-stock");
    expect(effectiveStatus({ ...base, availableSizes: [], status: "low-stock" })).toBe("low-stock");
  });
});
