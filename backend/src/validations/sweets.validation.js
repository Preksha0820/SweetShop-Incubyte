import { z } from "zod";

export const createSweetSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: z.string().min(2),
    price: z.number().min(0),
    quantity: z.number().int().min(0)
  })
});

export const updateSweetSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    category: z.string().min(2).optional(),
    price: z.number().min(0).optional(),
    quantity: z.number().int().min(0).optional()
  })
});

export const searchSweetSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional()
  })
});

export const purchaseSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1).default(1)
  })
});

export const restockSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1)
  })
});
