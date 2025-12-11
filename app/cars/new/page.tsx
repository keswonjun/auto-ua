'use client';

import { CarForm } from '@/components/CarForm';

export default function NewCarPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Додати нове авто</h1>
      <CarForm />
    </div>
  );
}
