import { z } from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        categoryName: z.string().min(3)
    })
});

export const updateCategorySchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    }),
    body: z.object({
        categoryName: z.string().min(3).optional()
    })
});

export const deleteCategorySchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    })
});
