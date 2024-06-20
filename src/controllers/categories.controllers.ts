import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import sendResponse from '../utils/responsehandler';
import errorHandler from '../utils/errorhandler';

const prisma = new PrismaClient();

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName) {
            throw new Error('Missing required fields');
        }
        const newCategory = await prisma.category.create({
            data: {
                CategoryName: categoryName
            }
        });

        sendResponse(res, 201, 'Category created successfully', newCategory);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};


export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        if(!id){
            throw new Error("Missing category ID")
        }
        if (!categoryName) {
            throw new Error('Missing required fields');
        }
        const updatedCategory = await prisma.category.update({
            where: { CategoryID: parseInt(id) },
            data: {
                CategoryName: categoryName
            }
        });

        sendResponse(res, 200, `Category ${id} updated successfully`, updatedCategory);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};


export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){
            throw new Error("Missing category ID")
        }
        await prisma.category.delete({
            where: { CategoryID: parseInt(id) }
        });

        sendResponse(res, 200, `Category ${id} deleted successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};


export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){
            throw new Error("Missing category ID")
        }
        const category = await prisma.category.findUnique({
            where: { CategoryID: parseInt(id) }
        });

        if (!category) {
            throw new Error(`Category with ID ${id} not found`);
        }

        sendResponse(res, 200, `Category found`, category);
    } catch (err: any) {
        errorHandler({ statusCode: 404, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const allCategories = await prisma.category.findMany();

        sendResponse(res, 200, 'List of all categories', allCategories);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};
