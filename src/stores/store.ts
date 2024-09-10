import create from 'zustand';

interface CartState {
  cartId: string | null;
  setCartId: (id: string) => void;
}

export const useStore = create<CartState>(set => ({
  cartId: null,
  setCartId: (id: string) => set({ cartId: id })
}));
