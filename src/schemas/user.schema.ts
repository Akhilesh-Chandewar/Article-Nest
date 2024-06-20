import { z } from 'zod';

export const registerUserSchema = z.object({
    body: z.object({
        email: z.string().email(),
        username: z.string().min(3),
        password: z.string().min(6),
        roleID: z.number().int()
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    }),
    body: z.object({
        email: z.string().email().optional(),
        username: z.string().min(3).optional(),
        password: z.string().min(6).optional()
    })
});

export const deleteUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/)
    })
});
