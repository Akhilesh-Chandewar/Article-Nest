import express from 'express';
import {
    createTag,
    updateTag,
    deleteTag,
    getTagById,
    getAllTags
} from '../controllers/tags.controllers';
import  isAuthenticated  from '../middlewares/authenticate.middleware';
import  hasRole  from '../middlewares/rbac.middleware';

import  validate  from '../middlewares/validate.middleware';
import {
    createTagSchema,
    updateTagSchema,
    deleteTagSchema
} from '../schemas/tag.schema';

const router = express.Router();

router.post('/', isAuthenticated, hasRole('Admin'), validate(createTagSchema), createTag);
router.put('/:id', isAuthenticated, hasRole('Admin'), validate(updateTagSchema), updateTag);
router.delete('/:id', isAuthenticated, hasRole('Admin'), validate(deleteTagSchema), deleteTag);
router.get('/', isAuthenticated, hasRole('User'), getAllTags);
router.get('/:id', isAuthenticated, hasRole('User'), getTagById);

export default router;