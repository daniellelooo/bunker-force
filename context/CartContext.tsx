"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; selectedSize: string; selectedColor?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; selectedSize: string; selectedColor?: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.selectedSize === action.payload.selectedSize &&
          i.selectedColor === action.payload.selectedColor
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.payload.productId &&
            i.selectedSize === action.payload.selectedSize &&
            i.selectedColor === action.payload.selectedColor
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) =>
            !(
              i.productId === action.payload.productId &&
              i.selectedSize === action.payload.selectedSize &&
              i.selectedColor === action.payload.selectedColor
            )
        ),
      };
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) =>
              !(
                i.productId === action.payload.productId &&
                i.selectedSize === action.payload.selectedSize &&
                i.selectedColor === action.payload.selectedColor
              )
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId &&
          i.selectedSize === action.payload.selectedSize &&
          i.selectedColor === action.payload.selectedColor
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    case "HYDRATE":
      return { items: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bunker-cart");
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        dispatch({ type: "HYDRATE", payload: items });
      }
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("bunker-cart", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const cartTax = cartSubtotal * 0.19;
  const cartTotal = cartSubtotal + cartTax;

  return (
    <CartContext.Provider
      value={{ state, dispatch, cartCount, cartSubtotal, cartTax, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
