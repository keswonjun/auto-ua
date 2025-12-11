'use client';

import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { removeFromCart, clearCart } from '../app/store/slices/cartSlice';
import { Button, Typography, List, ListItem, ListItemText } from '@mui/material';

export function Cart() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);

  const total = items.reduce((sum, car) => sum + car.price, 0);

  return (
    <div>
      <Typography variant="h5" gutterBottom>Ваш кошик</Typography>
      <List>
        {items.map((car) => (
          <ListItem key={car.id} secondaryAction={
            <Button color="error" onClick={() => dispatch(removeFromCart(car.id))}>Видалити</Button>
          }>
            <ListItemText primary={`${car.brand?.name} ${car.model}`} secondary={`${car.year} • ${car.price} $`} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Разом: {total} $</Typography>
      <Button variant="contained" color="primary" href="/checkout" sx={{ mt: 2 }}>Оформити замовлення</Button>
      <Button variant="outlined" color="error" onClick={() => dispatch(clearCart())} sx={{ mt: 2 }}>Очистити кошик</Button>
    </div>
  );
}
