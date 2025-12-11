import { prisma } from '@/lib/prisma';
import { CarForm } from '@/components/CarForm';
import { notFound } from 'next/navigation';

type Params = { id: string };

export default async function EditCarPage({ params }: { params: Params }) {
  const carId = Number(params.id);

  const car = await prisma.car.findUnique({
    where: { id: carId },
  });

  if (!car) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Редагувати авто #{car.id} – {car.model}
      </h1>
      <CarForm
        initialData={{
          id: car.id,
          model: car.model,
          year: car.year,
          price: car.price,
          brandId: car.brandId,
        }}
      />
    </div>
  );
}
