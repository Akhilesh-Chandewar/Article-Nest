import express from 'express';
import {
    createComment,
    updateComment,
    deleteComment,
    getCommentsForContent
} from '../controllers/comments.controllers';
import  isAuthenticated  from '../middlewares/authenticate.middleware';
import  hasRole  from '../middlewares/rbac.middleware';
import  validate  from '../middlewares/validate.middleware';
import {
    createCommentSchema,
    updateCommentSchema,
    deleteCommentSchema,
} from '../schemas/comment.schema';

const router = express.Router();

router.post('/:contentId', isAuthenticated, hasRole('User'), validate(createCommentSchema), createComment);
router.put('/:id', isAuthenticated, hasRole('User'), validate(updateCommentSchema), updateComment);
router.delete('/:id', isAuthenticated, hasRole('Admin'), validate(deleteCommentSchema), deleteComment);
router.get('/:contentId', isAuthenticated, hasRole('User'), getCommentsForContent);

export default router;
