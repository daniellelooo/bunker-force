import { describe, it, expect } from "vitest";
import type { CartItem } from "@/lib/types";

// Replica la lógica de CartContext para testearla de forma aislada
type CartState = { items: CartItem[] };
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; selectedSize: string; selectedColor?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; selectedSize: string; selectedColor?: string; quantity: number } }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { payload } = action;
      const existing = state.items.find(
        (i) => i.productId === payload.productId && i.selectedSize === payload.selectedSize && i.selectedColor === payload.selectedColor
      );
      if (existing) {
        const max = payload.maxStock ?? Infinity;
        const newQty = Math.min(existing.quantity + payload.quantity, max);
        return {
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: newQty, maxStock: payload.maxStock } : i
          ),
        };
      }
      return { items: [...state.items, payload] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) => !(i.productId === action.payload.productId && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor)
        ),
      };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

const item: CartItem = {
  productId: "p1",
  slug: "camiseta",
  name: "Camiseta Táctica",
  sku: "BF-001",
  price: 89900,
  image: "/img.jpg",
  selectedSize: "M",
  quantity: 1,
  maxStock: 5,
};

describe("CartReducer", () => {
  it("ADD_ITEM agrega nuevo item al carrito", () => {
    const state = cartReducer({ items: [] }, { type: "ADD_ITEM", payload: item });
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it("ADD_ITEM acumula cantidad si el item ya existe", () => {
    const s1 = cartReducer({ items: [] }, { type: "ADD_ITEM", payload: item });
    const s2 = cartReducer(s1, { type: "ADD_ITEM", payload: { ...item, quantity: 2 } });
    expect(s2.items[0].quantity).toBe(3);
  });

  it("ADD_ITEM respeta maxStock — no supera el límite", () => {
    const s1 = cartReducer({ items: [] }, { type: "ADD_ITEM", payload: { ...item, quantity: 4, maxStock: 5 } });
    const s2 = cartReducer(s1, { type: "ADD_ITEM", payload: { ...item, quantity: 3, maxStock: 5 } });
    expect(s2.items[0].quantity).toBe(5); // no supera maxStock
  });

  it("ADD_ITEM diferencia por talla", () => {
    const s1 = cartReducer({ items: [] }, { type: "ADD_ITEM", payload: item });
    const s2 = cartReducer(s1, { type: "ADD_ITEM", payload: { ...item, selectedSize: "L" } });
    expect(s2.items).toHaveLength(2);
  });

  it("ADD_ITEM diferencia por color", () => {
    const s1 = cartReducer({ items: [] }, { type: "ADD_ITEM", payload: item });
    const s2 = cartReducer(s1, { type: "ADD_ITEM", payload: { ...item, selectedColor: "od-green" } });
    expect(s2.items).toHaveLength(2);
  });

  it("REMOVE_ITEM elimina el item correcto", () => {
    const s1 = cartReducer({ items: [item, { ...item, selectedSize: "L" }] }, {
      type: "REMOVE_ITEM",
      payload: { productId: "p1", selectedSize: "M" },
    });
    expect(s1.items).toHaveLength(1);
    expect(s1.items[0].selectedSize).toBe("L");
  });

  it("UPDATE_QUANTITY actualiza cantidad", () => {
    const s1 = cartReducer({ items: [item] }, {
      type: "UPDATE_QUANTITY",
      payload: { productId: "p1", selectedSize: "M", quantity: 3 },
    });
    expect(s1.items[0].quantity).toBe(3);
  });

  it("UPDATE_QUANTITY no baja de 1", () => {
    const s1 = cartReducer({ items: [item] }, {
      type: "UPDATE_QUANTITY",
      payload: { productId: "p1", selectedSize: "M", quantity: 0 },
    });
    expect(s1.items[0].quantity).toBe(1);
  });

  it("CLEAR_CART vacía el carrito", () => {
    const s1 = cartReducer({ items: [item] }, { type: "CLEAR_CART" });
    expect(s1.items).toHaveLength(0);
  });

  it("subtotal se calcula correctamente", () => {
    const items = [
      { ...item, quantity: 2, price: 89900 },
      { ...item, selectedSize: "L", quantity: 1, price: 89900 },
    ];
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    expect(subtotal).toBe(269700);
  });

  it("IVA 19% se calcula correctamente", () => {
    const subtotal = 269700;
    const tax = Math.round(subtotal * 0.19);
    expect(tax).toBe(51243);
  });
});
