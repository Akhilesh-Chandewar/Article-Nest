import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import sendResponse from '../utils/responsehandler';
import errorHandler from '../utils/errorhandler';

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.params;
        const { commentText, userId } = req.body;
        if(!contentId){
            throw new Error("Missing content ID") 
        }
        const newComment = await prisma.comment.create({
            data: {
                CommentText: commentText,
                UserID: userId,
                ContentID: parseInt(contentId),
                CommentDate: new Date()
            }
        });

        sendResponse(res, 201, 'Comment created successfully', newComment);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const updateComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { commentText } = req.body;
        if(!id){
            throw new Error("Missing comment ID") 
        }
        if(!commentText){
            throw new Error("Missing required field") 
        }
        const updatedComment = await prisma.comment.update({
            where: { CommentID: parseInt(id) },
            data: {
                CommentText: commentText
            }
        });

        sendResponse(res, 200, `Comment ${id} updated successfully`, updatedComment);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){
            throw new Error("Missing comment ID") 
        }
        await prisma.comment.delete({
            where: { CommentID: parseInt(id) }
        });

        sendResponse(res, 200, `Comment ${id} deleted successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};

export const getCommentsForContent = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.params;
        if(!contentId){
            throw new Error("Missing content ID") 
        }
        const comments = await prisma.comment.findMany({
            where: { ContentID: parseInt(contentId) },
            include: {
                user: true
            }
        });

        sendResponse(res, 200, `Comments for content ${contentId}`, comments);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => {});
    } finally {
        await prisma.$disconnect();
    }
};


