import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import sendResponse from '../utils/responsehandler';
import errorHandler from '../utils/errorhandler';

const prisma = new PrismaClient();

export const createTag = async (req: Request, res: Response) => {
    try {
        const { tagName } = req.body;
        if(!tagName){
            throw new Error("Missing required field")
        }
        const newTag = await prisma.tag.create({
            data: {
                TagName: tagName
            }
        });

        sendResponse(res, 201, 'Tag created successfully', newTag);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const updateTag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tagName } = req.body;
        if(!id){
            throw new Error("Missing tag ID")
        }
        if(!tagName){
            throw new Error("Missing required field")
        }
        const updatedTag = await prisma.tag.update({
            where: { TagID: parseInt(id) },
            data: {
                TagName: tagName
            }
        });

        sendResponse(res, 200, `Tag ${id} updated successfully`, updatedTag);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const deleteTag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){
            throw new Error("Missing tag ID")
        }
        await prisma.tag.delete({
            where: { TagID: parseInt(id) }
        });

        sendResponse(res, 200, `Tag ${id} deleted successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const getTagById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){
            throw new Error("Missing tag ID")
        }
        const tag = await prisma.tag.findUnique({
            where: { TagID: parseInt(id) }
        });

        if (!tag) {
            throw new Error(`Tag with ID ${id} not found`);
        }

        sendResponse(res, 200, `Tag found`, tag);
    } catch (err: any) {
        errorHandler({ statusCode: 404, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const getAllTags = async (req: Request, res: Response) => {
    try {
        const allTags = await prisma.tag.findMany();

        sendResponse(res, 200, 'List of all tags', allTags);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};
