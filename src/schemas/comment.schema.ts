import { z } from 'zod';

export const createCommentSchema = z.object({
    body: z.object({
        commentText: z.string().min(3),
        commentDate: z.string(), // assuming ISO date string
        userID: z.number().int(),
        contentID: z.number().int()
    })
});

export const updateCommentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    }),
    body: z.object({
        commentText: z.string().min(3).optional(),
        commentDate: z.string().optional(), // assuming ISO date string
        userID: z.number().int().optional(),
        contentID: z.number().int().optional()
    })
});

export const deleteCommentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    })
});
