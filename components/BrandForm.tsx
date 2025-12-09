'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, type BrandInput } from '@/lib/validation';
import { useState } from 'react';

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
    defaultValues: {
      name: initialData?.name ?? '',
    },
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
      const message = e instanceof Error ? e.message : 'Сталася помилка';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Назва бренду</label>
        <input
          {...register('name')}
          className="mt-1 w-full rounded border px-3 py-2 text-sm"
          placeholder="Наприклад, Toyota"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {initialData ? 'Зберегти зміни' : 'Додати бренд'}
      </button>
    </form>
  );
}
