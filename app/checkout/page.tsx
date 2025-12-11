'use client';

import { useForm } from 'react-hook-form';
import { TextField, Button, Typography } from '@mui/material';

type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export default function CheckoutPage() {
  const { register, handleSubmit } = useForm<CheckoutForm>();

  const onSubmit = (data: CheckoutForm) => {
    alert(`Замовлення оформлено!\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Оформлення замовлення</Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}
      >
        <TextField label="Ім'я" {...register('name')} required />
        <TextField label="Телефон" {...register('phone')} required />
        <TextField label="Email" type="email" {...register('email')} required />
        <TextField label="Адреса доставки" {...register('address')} required />
        <Button type="submit" variant="contained" color="primary">
          Підтвердити замовлення
        </Button>
      </form>
    </div>
  );
}
