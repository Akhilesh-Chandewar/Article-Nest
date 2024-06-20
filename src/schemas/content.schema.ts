import { z } from 'zod';

export const createContentSchema = z.object({
    body: z.object({
        contentType: z.string(),
        title: z.string().min(3),
        contentDescription: z.string().min(10),
        userID: z.number().int(),
        categories: z.array(z.number().int()).optional(),
        tags: z.array(z.number().int()).optional()
    })
});

export const updateContentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    }),
    body: z.object({
        contentType: z.string().optional(),
        title: z.string().min(3).optional(),
        contentDescription: z.string().min(10).optional(),
        userID: z.number().int().optional(),
        categories: z.array(z.number().int()).optional(),
        tags: z.array(z.number().int()).optional()
    })
});

export const deleteContentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    })
});
