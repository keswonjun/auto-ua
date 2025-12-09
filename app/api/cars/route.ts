import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function GET() {
  const cars = await prisma.car.findMany({
    include: { brand: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(cars);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const car = await prisma.car.create({
      data: {
        model: body.model,
        year: Number(body.year),
        price: Number(body.price),
        brandId: Number(body.brandId),
      },
    });
    return NextResponse.json(car, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(e) ?? 'Помилка при створенні авто' },
      { status: 400 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'id обовʼязковий' }, { status: 400 });
    }

    const car = await prisma.car.update({
      where: { id: Number(id) },
      data: {
        model: rest.model,
        year: Number(rest.year),
        price: Number(rest.price),
        brandId: Number(rest.brandId),
      },
    });

    return NextResponse.json(car);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(e) ?? 'Помилка при оновленні авто' },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id обовʼязковий' }, { status: 400 });
    }
    await prisma.car.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(e) ?? 'Помилка при видаленні авто' },
      { status: 400 },
    );
  }
}
