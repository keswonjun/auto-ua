import { BrandList } from '@/components/BrandList';

export default function BrandsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Бренди</h1>
      <p className="text-sm text-slate-600">
        Управління брендами: додавання, редагування, видалення. Видалення бренду також
        видаляє всі його авто.
      </p>
      <BrandList />
    </div>
  );
}
