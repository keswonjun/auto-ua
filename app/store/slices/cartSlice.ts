import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Car } from './carsSlice';

type CartState = { items: Car[] };
const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Car>) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
