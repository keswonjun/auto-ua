'use client';

import { Cart } from '@/components/Cart';

export default function CartPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Кошик</h1>
      <Cart />
    </div>
  );
}
