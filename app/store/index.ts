import { configureStore } from '@reduxjs/toolkit';
import carsReducer from './slices/carsSlice';
import brandsReducer from './slices/brandsSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    brands: brandsReducer,
    cart: cartReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
