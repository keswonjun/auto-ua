'use client';

import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useAppDispatch } from '../app/store/hooks';
import { addToCart } from '../app/store/slices/cartSlice';
import type { Car } from '../app/store/slices/carsSlice';

export function CarCard({ car }: { car: Car }) {
  const dispatch = useAppDispatch();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="180"
        // якщо у Car немає imageUrl, показуємо заглушку з public/
        image={car.imageUrl ?? '/placeholder-car.jpg'}
        alt={car.model}
      />
      <CardContent>
        <Typography variant="h6">
          {car.brand?.name} {car.model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {car.year} • {car.price} $
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(addToCart(car))}
          sx={{ mt: 2 }}
        >
          Додати в кошик
        </Button>
      </CardContent>
    </Card>
  );
}
