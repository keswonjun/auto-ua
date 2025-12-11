'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carSchema, type CarInput } from '@/lib/validation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, MenuItem, Alert } from '@mui/material';
import styles from './CarForm.module.css';

type Brand = { id: number; name: string };

type Props = { initialData?: { id: number; model: string; year: number; price: number; brandId: number } };

export function CarForm({ initialData }: Props) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CarInput>({
    resolver: zodResolver(carSchema),
    defaultValues: initialData ?? {
      model: '',
      year: new Date().getFullYear(),
      price: 10000,
      brandId: 0,
      brandName: '',
    },
  });

  useEffect(() => {
    fetch('/api/brands').then(res => res.json()).then(setBrands).catch(() => setBrands([]));
  }, []);

  const onSubmit = async (data: CarInput) => {
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // додаємо файл
      const fileInput = (document.getElementById('image') as HTMLInputElement);
      if (fileInput?.files?.[0]) {
        formData.append('image', fileInput.files[0]);
      }

      const res = await fetch('/api/cars', {
        method: initialData ? 'PUT' : 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Помилка запиту');
      await res.json();
      router.push('/');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Сталася помилка');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TextField label="Модель" {...register('model')} error={!!errors.model} helperText={errors.model?.message} fullWidth />
      <div className={styles.row}>
        <TextField label="Рік" type="number" {...register('year', { valueAsNumber: true })} error={!!errors.year} helperText={errors.year?.message} />
        <TextField label="Ціна $" type="number" {...register('price', { valueAsNumber: true })} error={!!errors.price} helperText={errors.price?.message} />
        <TextField select label="Бренд" {...register('brandId', { valueAsNumber: true })} error={!!errors.brandId} helperText={errors.brandId?.message}>
          <MenuItem value={0}>Оберіть бренд</MenuItem>
          {brands.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
        </TextField>
      </div>
      <TextField label="Новий бренд (опціонально)" {...register('brandName')} error={!!errors.brandName} helperText={errors.brandName?.message} fullWidth />

      {/* поле для завантаження фото */}
      <input id="image" type="file" accept="image/*" />

      {error && <Alert severity="error">{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        {initialData ? 'Зберегти зміни' : 'Додати авто'}
      </Button>
    </form>
  );
}