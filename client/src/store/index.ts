import { create } from 'zustand';

interface State {
    cartIsOpen: boolean;
    toggleCart: () => void;

    subtotal: number;
    setSubtotal: (subtotal: number) => void;
}

export const useStore = create<State>((set) => ({
    cartIsOpen: false,
    toggleCart: () => set((state) => ({ cartIsOpen: !state.cartIsOpen })),

    subtotal: 0,
    setSubtotal: (subtotal) => set(() => ({ subtotal }))
}));
