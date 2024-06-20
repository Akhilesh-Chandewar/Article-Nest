import { z } from 'zod';

export const createRoleSchema = z.object({
    body: z.object({
        roleName: z.string().min(3)
    })
});

export const updateRoleSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    }),
    body: z.object({
        roleName: z.string().min(3).optional()
    })
});

export const deleteRoleSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    })
});
