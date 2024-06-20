import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import sendResponse from '../utils/responsehandler';
import errorHandler from '../utils/errorhandler';

const prisma = new PrismaClient();

// Create Role
export const createRole = async (req: Request, res: Response) => {
    try {
        const { roleName } = req.body;
        if (!roleName) {
            throw new Error('Missing required fields');
        }
        const newRole = await prisma.role.create({
            data: {
                RoleName: roleName
            }
        });
        sendResponse(res, 201, 'Role created successfully', newRole);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

// Update Role
export const updateRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { roleName } = req.body;
        if (!id) {
            throw new Error('Missing role ID');
        }
        if (!roleName) {
            throw new Error('Missing required fields');
        }
        const updatedRole = await prisma.role.update({
            where: { RoleID: parseInt(id) },
            data: {
                RoleName: roleName
            }
        });

        sendResponse(res, 200, `Role ${id} updated successfully`, updatedRole);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

// Delete Role
export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {

            throw new Error('Missing role ID')
        }
        await prisma.role.delete({
            where: { RoleID: parseInt(id) }
        });

        sendResponse(res, 200, `Role ${id} deleted successfully`);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

// Get Role by ID
export const getRoleById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {

            throw new Error('Missing role ID')
        }
        const role = await prisma.role.findUnique({
            where: { RoleID: parseInt(id) }
        });

        if (!role) {
            throw new Error(`Role with ID ${id} not found`);
        }

        sendResponse(res, 200, `Role found`, role);
    } catch (err: any) {
        errorHandler({ statusCode: 404, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};

// List All Roles
export const getAllRoles = async (req: Request, res: Response) => {
    try {
        const allRoles = await prisma.role.findMany();

        sendResponse(res, 200, 'List of all roles', allRoles);
    } catch (err: any) {
        errorHandler({ statusCode: 400, message: err.message }, req, res, () => { });
    } finally {
        await prisma.$disconnect();
    }
};
