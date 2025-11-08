import { create } from "zustand";
import { getCart, addToCart, removeFromCart } from "@/service/ecomService";

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface RawCartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface RawCartItem {
  _id: string;
  productId: RawCartProduct;
  qty: number;
}

interface CartResponse {
  items: RawCartItem[];
}

interface CartStore {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (productId: string, qty?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],


  fetchCart: async () => {
    try {
      const rawResponse = await getCart();
      const response: CartResponse =
        (rawResponse as any).data?.items
          ? (rawResponse as any).data
          : (rawResponse as any);

      if (!response.items || !Array.isArray(response.items)) {
        console.error("Invalid cart response:", response);
        set({ items: [] });
        return;
      }

      const normalizedItems: CartItem[] = response.items.map((item) => ({
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        category: item.productId.category,
        description: item.productId.description,
        quantity: item.qty,
      }));

      set({ items: normalizedItems });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      set({ items: [] });
    }
  },

  addItem: async (productId, qty = 1) => {
    await addToCart(productId, qty);
    await get().fetchCart();
  },

  removeItem: async (productId) => {
    const prevItems = get().items;
    set({ items: prevItems.filter((item) => item._id !== productId) });

    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Remove failed, reverting:", error);
      set({ items: prevItems }); // rollback
    }
  },

  updateQuantity: async (productId, newQuantity) => {
    const prevItems = get().items;
    const updatedItems = prevItems.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );

    set({ items: updatedItems });

    try {
      await addToCart(productId, newQuantity);
    } catch (error) {
      console.error("Update failed, reverting:", error);
      set({ items: prevItems });
    }
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));
