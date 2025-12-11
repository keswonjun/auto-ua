import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type Car = {
  id: number;
  model: string;
  year: number;
  price: number;
  brandId: number;
  brand?: { id: number; name: string };
  imageUrl?: string;
};

type CarsState = { items: Car[]; loading: boolean; error: string | null };
const initialState: CarsState = { items: [], loading: false, error: null };

export const fetchCars = createAsyncThunk<Car[], { brand?: string; year?: string; maxPrice?: string } | undefined>(
  'cars/fetch',
  async (filters) => {
    const params = new URLSearchParams();
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.year) params.append('year', filters.year);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);

    const query = params.toString();
    const res = await fetch(`/api/cars${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Помилка завантаження авто');
    return res.json();
  }
);

export const deleteCar = createAsyncThunk<number, number>(
  'cars/delete',
  async (id) => {
    const res = await fetch(`/api/cars?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error ?? 'Помилка видалення авто');
    }
    return id;
  }
);

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCars.fulfilled, (s, a) => {
        s.items = a.payload;
        s.loading = false;
      })
      .addCase(fetchCars.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Помилка';
      })
      .addCase(deleteCar.fulfilled, (s, a) => {
        s.items = s.items.filter((c) => c.id !== a.payload);
      });
  },
});

export default carsSlice.reducer;
