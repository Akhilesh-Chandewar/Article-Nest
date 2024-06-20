import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import sendResponse from '../utils/responsehandler';
import errorHandler from '../utils/errorhandler';
import { CookieOptions } from 'express-serve-static-core';

const prisma = new PrismaClient();

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, username, password, roleID} = req.body;
        if (!email || !username || !password) {
            throw new Error('Missing required fields');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await prisma.user.create({
            data: {
                Username: username,
                Email: email,
                Password: hashedPassword,
                RoleID : roleID
            }
        });
        sendResponse(res, 200, `${username} registered successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const secretKey = process.env.JWT_SECRET;
        if (!email || !password) {
            throw new Error('Missing email or password');
        }

        const user = await prisma.user.findUnique({
            where: { Email: email }
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ userId: user.UserID }, `${secretKey}`, { expiresIn: '24h' });

        // Set cookie with the JWT token
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };

        res.cookie('token', token, cookieOptions);

        sendResponse(res, 200, 'Login successful', { token });
    } catch (err: any) {
        errorHandler({ statusCode: 401, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};


// Update an existing user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        const { email, username, password } = req.body;

        if (!id) {
            throw new Error('Missing user ID');
        }

        const existingUser = await prisma.user.findUnique({
            where: { UserID: userId }
        });

        if (!existingUser) {
            throw new Error(`User with ID ${id} not found`);
        }

        const updateData: any = {};
        if (email) updateData.Email = email;
        if (username) updateData.Username = username;
        if (password) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.Password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { UserID: userId },
            data: updateData
        });

        sendResponse(res, 200, `User ${id} updated successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

// Delete an existing user
export const removeUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        if (!id) {
            throw new Error('Missing user ID');
        }
        await prisma.user.delete({
            where: { UserID: userId }
        });
        sendResponse(res, 200, `User ${id} deleted successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany();
        sendResponse(res, 200, 'List of all users', allUsers);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};



export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                Username: req.params.username
            }
        });

        if (!user) {
            // If user is not found, send a 404 Not Found response
            throw new Error('User not found');
        }

        // If user is found, send a success response with the user details
        sendResponse(res, 200, 'User found', user);
    } catch (err: any) {
        // Handle errors
        errorHandler({ statusCode: 404, message: err.message }, req, res, () => { });
    } finally {
        // Disconnect Prisma client
        await prisma.$disconnect();
    }
};
