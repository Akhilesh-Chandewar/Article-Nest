import express from 'express';
import {
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    getAllRoles
} from '../controllers/roles.controllers';
import isAuthenticated  from '../middlewares/authenticate.middleware';
import  hasRole  from '../middlewares/rbac.middleware';

import  validate  from '../middlewares/validate.middleware';
import {
    createRoleSchema,
    updateRoleSchema,
    deleteRoleSchema
} from '../schemas/role.schema';

const router = express.Router();

router.post('/', isAuthenticated, hasRole('Admin'), validate(createRoleSchema), createRole);
router.put('/:id', isAuthenticated, hasRole('Admin'), validate(updateRoleSchema), updateRole);
router.delete('/:id', isAuthenticated, hasRole('Admin'), validate(deleteRoleSchema), deleteRole);
router.get('/', isAuthenticated, hasRole('Admin'), getAllRoles);
router.get('/:id', isAuthenticated, hasRole('Admin'), getRoleById);

export default router;