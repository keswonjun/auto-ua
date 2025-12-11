import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string().min(2, 'Назва має містити мінімум 2 символи'),
});

export type BrandInput = z.infer<typeof brandSchema>;

export const carSchema = z.object({
  model: z.string().min(2, 'Модель має містити мінімум 2 символи'),

  year: z
    .number()
    .min(1980, 'Рік не може бути меншим за 1980')
    .max(new Date().getFullYear() + 1, 'Рік надто великий'),

  price: z.number().min(100, 'Ціна має бути більшою за 100'),

  brandId: z.number().optional(),
  brandName: z.string().optional(),

  imageUrl: z.string().optional(),
});

export type CarInput = z.infer<typeof carSchema>;
