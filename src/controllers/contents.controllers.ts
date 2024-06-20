import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import sendResponse from '../utils/responsehandler';
import errorHandler from '../utils/errorhandler';

const prisma = new PrismaClient();

export const createContent = async (req: Request, res: Response) => {
    try {
        const {
            contentType,
            title,
            contentDescription,
            userId,
            categoryIds,
            tagIds
        } = req.body;

        if (!contentType || !title || !contentDescription || !userId || !categoryIds || !tagIds) {
            throw new Error('Missing required fields');
        }
        const newContent = await prisma.content.create({
            data: {
                ContentType: contentType,
                Title: title,
                ContentDescription: contentDescription,
                UserID: userId,
                categories: {
                    connect: categoryIds.map((id: number) => ({ CategoryID: id }))
                },
                tags: {
                    connect: tagIds.map((id: number) => ({ TagID: id }))
                }
            }
        });

        sendResponse(res, 201, 'Content created successfully', newContent);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

export const updateContent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            contentType,
            title,
            contentDescription,
            userId,
            categoryIds,
            tagIds
        } = req.body;
        if (!id) {
            throw new Error('Missing content ID');
        }
        if (!contentType || !title || !contentDescription || !userId || !categoryIds || !tagIds) {
            throw new Error('Missing required fields');
        }
        const updatedContent = await prisma.content.update({
            where: { ContentID: parseInt(id) },
            data: {
                ContentType: contentType,
                Title: title,
                ContentDescription: contentDescription,
                UserID: userId,
                categories: {
                    set: categoryIds.map((id: number) => ({ CategoryID: id }))
                },
                tags: {
                    set: tagIds.map((id: number) => ({ TagID: id }))
                }
            }
        });

        sendResponse(res, 200, `Content ${id} updated successfully`, updatedContent);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

export const deleteContent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Missing content ID');
        }
        await prisma.content.delete({
            where: { ContentID: parseInt(id) }
        });

        sendResponse(res, 200, `Content ${id} deleted successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

export const getContentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('Missing content ID');
        }
        const content = await prisma.content.findUnique({
            where: { ContentID: parseInt(id) },
            include: {
                author: true,
                categories: true,
                tags: true,
                comments: true
            }
        });

        if (!content) {
            throw new Error(`Content with ID ${id} not found`);
        }

        sendResponse(res, 200, `Content found`, content);
    } catch (err: any) {
        errorHandler({ statusCode: 404, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const getAllContents = async (req: Request, res: Response) => {
    try {
        const allContents = await prisma.content.findMany();

        sendResponse(res, 200, 'List of all contents', allContents);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};
