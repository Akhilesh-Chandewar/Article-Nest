import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import errorHandler from '../utils/errorhandler';

const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Middleware to check user's role
const hasRole = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.UserID;

            if (!userId) {
                throw new Error('User not authenticated');
            }

            const user = await prisma.user.findUnique({
                where: { UserID: userId },
                include: { Role: true }
            });

            if (!user) {
                throw new Error('User not found');
            }

            if (user.Role.RoleName !== role) {
                throw new Error('Access denied');
            }

            next();
        } catch (err: any) {
            errorHandler({ statusCode: 403, message: err.message }, req, res, next);
        }
    };
};

export default hasRole;
