import express from 'express';
import {
    createContent,
    updateContent,
    deleteContent,
    getContentById,
    getAllContents
} from '../controllers/contents.controllers';
import  isAuthenticated  from '../middlewares/authenticate.middleware';
import  hasRole  from '../middlewares/rbac.middleware';

import  validate  from '../middlewares/validate.middleware';
import {
    createContentSchema,
    updateContentSchema,
    deleteContentSchema
} from '../schemas/content.schema';

const router = express.Router();

router.post('/', isAuthenticated, hasRole('Author'), validate(createContentSchema), createContent);
router.put('/:id', isAuthenticated, hasRole('Author'), validate(updateContentSchema), updateContent);
router.delete('/:id', isAuthenticated, hasRole('Admin'), validate(deleteContentSchema), deleteContent);
router.get('/:id', isAuthenticated, hasRole('User'), getContentById);
router.get('/', isAuthenticated, hasRole('User'), getAllContents);

export default router;