'use client';

import { CarForm } from '@/components/CarForm';

export default function NewCarPage() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 className="mb-4 text-xl font-semibold">Додати нове авто</h1>
      <CarForm />
    </div>
  );
}
