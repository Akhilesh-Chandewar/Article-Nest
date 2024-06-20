import express from 'express';
import {
    registerUser,
    login,
    updateUser,
    removeUser,
    getAllUsers,
    getUser
} from '../controllers/users.controllers';
import  isAuthenticated  from '../middlewares/authenticate.middleware';
import  hasRole  from '../middlewares/rbac.middleware';

import  validate  from '../middlewares/validate.middleware';
import {
    registerUserSchema,
    loginSchema,
    updateUserSchema,
    deleteUserSchema
} from '../schemas/user.schema';

const router = express.Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginSchema), login);
router.put('/:id', isAuthenticated, hasRole('Admin'), validate(updateUserSchema), updateUser);
router.delete('/:id', isAuthenticated, hasRole('Admin'), validate(deleteUserSchema), removeUser);
router.get('/', isAuthenticated, hasRole('Admin'), getAllUsers);
router.get('/:username', isAuthenticated, hasRole('User'), getUser);

export default router;