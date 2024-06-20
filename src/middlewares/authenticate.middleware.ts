import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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

// Middleware to authenticate requests
const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from the request cookies
        const token = req.cookies.token;
        const secretKey = process.env.JWT_SECRET;

        if (!token) {
            throw new Error('Authentication failed');
        }

        // Verify the token
        const decodedToken: any = jwt.verify(token, `${secretKey}`);
        
        // Check if the decoded token contains a userId
        if (!decodedToken.userId) {
            throw new Error('Invalid token');
        }

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { UserID: decodedToken.userId }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Attach the user object to the request for further processing
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (err: any) {
        // Handle authentication errors
        errorHandler({ statusCode: 401, message: err.message }, req, res, next);
    }
};

export default isAuthenticated
