import { z } from 'zod';

import { parseDateValue } from './date';

export const productExtraSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'validation.extraTitleRequired'),
  amount: z.coerce
    .number()
    .positive('validation.extraAmountPositive'),
});

export const productSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'validation.productNameRequired'),
  price: z.coerce.number().positive('validation.pricePositive'),
  quantity: z.coerce
    .number()
    .int('validation.quantityWhole')
    .min(1, 'validation.quantityMin')
    .max(100, 'validation.quantityMax'),
  extras: z.array(productExtraSchema).default([]),
});

export const shoppingCartSchema = z.object({
  title: z.string().trim(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'validation.dateFormat')
    .refine(value => parseDateValue(value) !== null, {
      message: 'validation.dateFormat',
    }),
  products: z.array(productSchema).min(1, 'validation.productsMin'),
});

export type ShoppingCartFormValues = z.input<typeof shoppingCartSchema>;
export type ShoppingCartFormData = z.output<typeof shoppingCartSchema>;
