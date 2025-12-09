'use client';

import { useEffect, useState } from 'react';
import { BrandForm } from './BrandForm';

type Brand = {
  id: number;
  name: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/brands');
      const data: Brand[] = await res.json();
      setBrands(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e) ?? 'Не вдалося завантажити бренди');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити бренд (також будуть видалені його авто)?')) return;
    try {
      const res = await fetch(`/api/brands?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Помилка видалення');
      }
      await loadBrands();
    } catch (e: unknown) {
      alert(getErrorMessage(e) ?? 'Сталася помилка');
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-lg font-semibold">Додати бренд</h2>
        <BrandForm onSaved={loadBrands} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Список брендів</h2>
        {loading && <p className="text-sm text-slate-500">Завантаження…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && brands.length === 0 && (
          <p className="text-sm text-slate-500">Поки що немає жодного бренду.</p>
        )}

        <ul className="divide-y rounded border bg-white">
          {brands.map((brand) => (
            <li
              key={brand.id}
              className="flex items-center justify-between px-3 py-2 text-sm"
            >
              <span>{brand.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(brand)}
                  className="rounded border px-2 py-1 text-xs"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="rounded border border-red-500 px-2 py-1 text-xs text-red-600"
                >
                  Видалити
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {editing && (
        <section className="rounded border bg-white p-3">
          <h2 className="mb-2 text-lg font-semibold">
            Редагувати бренд: {editing.name}
          </h2>
          <BrandForm
            initialData={editing}
            onSaved={() => {
              setEditing(null);
              loadBrands();
            }}
          />
        </section>
      )}
    </div>
  );
}
