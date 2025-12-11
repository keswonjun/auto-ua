'use client';

import { TextField, Button } from '@mui/material';
import { useState } from 'react';

export function CarFilters({ onFilter }: { onFilter: (filters: any) => void }) {
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  return (
    <div className="flex gap-4 mb-6">
      <TextField label="Бренд" value={brand} onChange={e => setBrand(e.target.value)} />
      <TextField label="Рік" value={year} onChange={e => setYear(e.target.value)} />
      <TextField label="Ціна до" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
      <Button variant="contained" onClick={() => onFilter({ brand, year, maxPrice })}>
        Фільтрувати
      </Button>
    </div>
  );
}
