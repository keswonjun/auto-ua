import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { brandSchema } from '@/lib/validation';

// утилита для извлечения текста ошибки
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(brands);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = brandSchema.parse(body);

    const brand = await prisma.brand.create({
      data: {
        name: parsed.name,
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(e) ?? 'Помилка при створенні бренду' },
      { status: 400 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    const parsed = brandSchema.parse(rest);

    const brand = await prisma.brand.update({
      where: { id: Number(id) },
      data: parsed,
    });

    return NextResponse.json(brand);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(e) ?? 'Помилка при оновленні бренду' },
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

    await prisma.car.deleteMany({ where: { brandId: Number(id) } });
    await prisma.brand.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(e) ?? 'Помилка при видаленні бренду' },
      { status: 400 },
    );
  }
}
