import { create } from 'zustand';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';
import { useUserStore } from './userStore';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loadCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  checkout: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loadCart: async () => {
    const token = useUserStore.getState().token;
    if (!token) return;
    const res = await axios.get(`${API_CONFIG.API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ items: (res.data.items || []).map((i: any) => ({
      id: i.productId,
      title: i.title,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
    })) });
  },
  addToCart: async (item) => {
    const token = useUserStore.getState().token;
    if (!token) return;
    await axios.post(`${API_CONFIG.API_URL}/cart/add`, {
      productId: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().loadCart();
  },
  removeFromCart: async (id) => {
    const token = useUserStore.getState().token;
    if (!token) return;
    await axios.post(`${API_CONFIG.API_URL}/cart/remove`, { productId: id }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().loadCart();
  },
  clearCart: async () => {
    const token = useUserStore.getState().token;
    if (!token) return;
    await axios.post(`${API_CONFIG.API_URL}/cart/clear`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ items: [] });
  },
  updateQuantity: async (id, quantity) => {
    const token = useUserStore.getState().token;
    if (!token) return;
    await axios.post(`${API_CONFIG.API_URL}/cart/update`, { productId: id, quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().loadCart();
  },
  checkout: async () => {
    const token = useUserStore.getState().token;
    if (!token) return;
    await axios.post(`${API_CONFIG.API_URL}/orders`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ items: [] });
  },
}));