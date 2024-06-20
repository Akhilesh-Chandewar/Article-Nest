import { z } from 'zod';

export const createTagSchema = z.object({
    body: z.object({
        tagName: z.string().min(3)
    })
});

export const updateTagSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    }),
    body: z.object({
        tagName: z.string().min(3).optional()
    })
});

export const deleteTagSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    })
});
