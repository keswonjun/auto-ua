import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get('brand');
  const year = searchParams.get('year');
  const maxPrice = searchParams.get('maxPrice');

  const cars = await prisma.car.findMany({
    where: {
      ...(brand ? { brand: { name: { contains: brand } } } : {}),
      ...(year ? { year: Number(year) } : {}),
      ...(maxPrice ? { price: { lte: Number(maxPrice) } } : {}),
    },
    include: { brand: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(cars);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const model = formData.get('model') as string;
    const year = Number(formData.get('year'));
    const price = Number(formData.get('price'));
    const brandId = Number(formData.get('brandId'));
    const brandName = formData.get('brandName') as string | null;
    const file = formData.get('image') as File | null;

    let imageUrl: string | null = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);

      await fs.writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const result = await prisma.$transaction(async (tx) => {
      let brandIdToUse = brandId;

      if ((!brandId || brandId === 0) && brandName) {
        const brand = await tx.brand.create({ data: { name: brandName } });
        brandIdToUse = brand.id;
      }

      const car = await tx.car.create({
        data: {
          model,
          year,
          price,
          brandId: brandIdToUse,
          imageUrl,
        },
      });

      return car;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(e) ?? 'Помилка при створенні авто' },
      { status: 400 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'id обовʼязковий' }, { status: 400 });
    }

    const model = formData.get('model') as string;
    const year = Number(formData.get('year'));
    const price = Number(formData.get('price'));
    const brandId = Number(formData.get('brandId'));
    const file = formData.get('image') as File | null;

    let imageUrl: string | undefined;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);

      await fs.writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const car = await prisma.car.update({
      where: { id },
      data: {
        model,
        year,
        price,
        brandId,
        ...(imageUrl ? { imageUrl } : {}),
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
