'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Car = {
  id: number;
  model: string;
  year: number;
  price: number;
  brand: { id: number; name: string };
};

type Brand = { id: number; name: string };

export function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filters, setFilters] = useState({
    brandId: '',
    minPrice: '',
    maxPrice: '',
    q: '',
  });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (filters.brandId) params.set('brandId', filters.brandId);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.q) params.set('q', filters.q);

    const carsRes = await fetch(`/api/cars?${params.toString()}`);
    const carsData = await carsRes.json();
    setCars(carsData);
    setLoading(false);
  };

  const loadBrands = async () => {
    const res = await fetch('/api/brands');
    const data = await res.json();
    setBrands(data);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити авто?')) return;
    await fetch(`/api/cars?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="space-y-4">
      <section className="rounded border bg-white p-3">
        <h2 className="mb-2 text-sm font-semibold">Фільтрація</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="block text-xs font-medium">Бренд</label>
            <select
              value={filters.brandId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, brandId: e.target.value }))
              }
              className="mt-1 w-full rounded border px-2 py-1 text-xs"
            >
              <option value="">Усі</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium">Мін. ціна</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minPrice: e.target.value }))
              }
              className="mt-1 w-full rounded border px-2 py-1 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">Макс. ціна</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxPrice: e.target.value }))
              }
              className="mt-1 w-full rounded border px-2 py-1 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">Пошук (модель/бренд)</label>
            <input
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              className="mt-1 w-full rounded border px-2 py-1 text-xs"
              placeholder="Corolla, BMW…"
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Авто</h2>
          <Link
            href="/cars/new"
            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white"
          >
            Додати авто
          </Link>
        </div>

        {loading && <p className="text-sm text-slate-500">Завантаження…</p>}

        {!loading && cars.length === 0 && (
          <p className="text-sm text-slate-500">
            Нічого не знайдено. Додайте авто або змініть фільтри.
          </p>
        )}

        <ul className="divide-y rounded border bg-white">
          {cars.map((car) => (
            <li
              key={car.id}
              className="flex items-center justify-between px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium">
                  {car.brand.name} {car.model}, {car.year}
                </p>
                <p className="text-xs text-slate-500">{car.price} $</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/cars/${car.id}`}
                  className="rounded border px-2 py-1 text-xs"
                >
                  Редагувати
                </Link>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="rounded border border-red-500 px-2 py-1 text-xs text-red-600"
                >
                  Видалити
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
