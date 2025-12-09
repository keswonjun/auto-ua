import { CarList } from '@/components/CarList';
import './globals.css';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Список авто</h1>
      <p className="text-sm text-slate-600">
        Фільтрація за брендом, ціною та пошук по моделі/бренду. Додавання, зміна,
        видалення.
      </p>
      <CarList />
    </div>
  );
}
