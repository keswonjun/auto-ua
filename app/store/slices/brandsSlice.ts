import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type Brand = { id: number; name: string };

type BrandsState = { items: Brand[]; loading: boolean; error: string | null };
const initialState: BrandsState = { items: [], loading: false, error: null };

export const fetchBrands = createAsyncThunk<Brand[]>(
  'brands/fetch',
  async () => {
    const res = await fetch('/api/brands');
    if (!res.ok) throw new Error('Помилка завантаження брендів');
    return res.json();
  }
);

export const deleteBrand = createAsyncThunk<number, number>(
  'brands/delete',
  async (id) => {
    const res = await fetch(`/api/brands?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error ?? 'Помилка видалення бренду');
    }
    return id;
  }
);

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchBrands.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; })
      .addCase(fetchBrands.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Помилка'; })
      .addCase(deleteBrand.fulfilled, (s, a) => {
        s.items = s.items.filter((b) => b.id !== a.payload);
      });
  },
});

export default brandsSlice.reducer;
