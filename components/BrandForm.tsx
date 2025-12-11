'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, type BrandInput } from '@/lib/validation';
import { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import styles from './BrandForm.module.css';

type Props = {
  initialData?: { id: number; name: string };
  onSaved?: () => void;
};

export function BrandForm({ initialData, onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BrandInput>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: initialData?.name ?? '' },
  });

  const onSubmit = async (data: BrandInput) => {
    setError(null);
    try {
      const res = await fetch('/api/brands', {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData ? { id: initialData.id, ...data } : data),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Помилка запиту');
      }
      if (!initialData) reset();
      onSaved?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Сталася помилка');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TextField
        label="Назва бренду"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        size="small"
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        {initialData ? 'Зберегти зміни' : 'Додати бренд'}
      </Button>
    </form>
  );
}
