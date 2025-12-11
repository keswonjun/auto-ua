'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchCars } from './store/slices/carsSlice';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';   // ← замість Grid
import { CarCard } from '../components/CarCard';
import { CarFilters } from '../components/CarFilters';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items: cars, loading } = useAppSelector((s) => s.cars);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(fetchCars(filters));
  }, [dispatch, filters]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Ласкаво просимо до Auto.ua — ваш магазин авто
      </Typography>

      <CarFilters onFilter={setFilters} />

      {loading && <p>Завантаження…</p>}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        justifyContent="flex-start"
      >
        {cars.map((car) => (
          <Box
            key={car.id}
            flexBasis={{ xs: '100%', sm: '48%', md: '30%' }}
          >
            <CarCard car={car} />
          </Box>
        ))}
      </Box>
    </div>
  );
}
