import express from 'express';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getAllCategories
} from '../controllers/categories.controllers';
import  isAuthenticated  from '../middlewares/authenticate.middleware';
import  hasRole  from '../middlewares/rbac.middleware';

import  validate  from '../middlewares/validate.middleware';
import {
    createCategorySchema,
    updateCategorySchema,
    deleteCategorySchema
} from '../schemas/category.schema';

const router = express.Router();

router.post('/', isAuthenticated, hasRole('Admin'), validate(createCategorySchema), createCategory);
router.put('/:id', isAuthenticated, hasRole('Admin'), validate(updateCategorySchema), updateCategory);
router.delete('/:id', isAuthenticated, hasRole('Admin'), validate(deleteCategorySchema), deleteCategory);
router.get('/', isAuthenticated, hasRole('User'), getAllCategories);
router.get('/:id', isAuthenticated, hasRole('User'), getCategoryById);

export default router;
