import { z } from 'zod';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const productExtraSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'Extra price title is required'),
  amount: z.coerce.number().positive('Extra price must be greater than 0'),
});

export const productSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'Product name is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(100, 'Quantity must be at most 100'),
  extras: z.array(productExtraSchema).default([]),
});

export const shoppingCartSchema = z.object({
  title: z
    .string()
    .trim()
    .transform(value => value || 'Shopping'),
  date: z.string().regex(datePattern, 'Date must be in YYYY-MM-DD format'),
  products: z.array(productSchema).min(1, 'Add at least one product'),
});

export type ShoppingCartFormValues = z.input<typeof shoppingCartSchema>;
export type ShoppingCartFormData = z.output<typeof shoppingCartSchema>;
