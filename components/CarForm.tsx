'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carSchema, type CarInput } from '@/lib/validation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Brand = { id: number; name: string };

type Props = {
  initialData?: {
    id: number;
    model: string;
    year: number;
    price: number;
    brandId: number;
  };
};

export function CarForm({ initialData }: Props) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CarInput>({
    resolver: zodResolver(carSchema),
    defaultValues: initialData
      ? {
          model: initialData.model,
          year: initialData.year,
          price: initialData.price,
          brandId: initialData.brandId,
        }
      : {
          model: '',
          year: new Date().getFullYear(),
          price: 10000,
          brandId: 0,
        },
  });

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        const data = await res.json();
        setBrands(data);
      } catch {
        setBrands([]);
      }
    };
    loadBrands();
  }, []);

  const onSubmit = async (data: CarInput) => {
    setError(null);
    try {
      const res = await fetch('/api/cars', {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          initialData ? { id: initialData.id, ...data } : data,
        ),
      });

      if (!res.ok) {
        // захист від пустого body
        let message = 'Помилка запиту';
        try {
          const j = await res.json();
          if (j?.error) message = j.error;
        } catch {
          // якщо body пусте, залишаємо дефолтне повідомлення
        }
        throw new Error(message);
      }

      // безпечне парсування навіть якщо body пусте
      await res.json().catch(() => {});
      router.push('/');
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Сталася помилка';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Модель</label>
        <input
          {...register('model')}
          className="mt-1 w-full rounded border px-3 py-2 text-sm"
          placeholder="Наприклад, Corolla"
        />
        {errors.model && (
          <p className="mt-1 text-xs text-red-600">{errors.model.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">Рік</label>
          <input
            type="number"
            {...register('year', { valueAsNumber: true })}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
          {errors.year && (
            <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Ціна</label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Бренд</label>
          <select
            {...register('brandId', { valueAsNumber: true })}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          >
            <option value={0}>Оберіть бренд</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="mt-1 text-xs text-red-600">{errors.brandId.message}</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {initialData ? 'Зберегти зміни' : 'Додати авто'}
      </button>
    </form>
  );
}
