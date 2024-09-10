import create from 'zustand';

const useStore = create((set) => ({
  cartId: null,
  setCartId: (id) => set(() => ({ cartId: id }))
}));

export default useStore;
