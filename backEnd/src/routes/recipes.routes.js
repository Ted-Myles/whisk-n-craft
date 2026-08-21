import express from 'express';
const router = express.Router();

import * as recipesController from '../controllers/recipes.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import { uploadRecipeMedia, uploadSingleImage } from '../middlewares/upload.middleware.js';

// ----------------------------------------------------------------------------
// PUBLIC — no auth, published recipes only
// ----------------------------------------------------------------------------
router.get('/', recipesController.list);                    // GET /api/recipes?categoryId=&nationalityId=
router.get('/search', recipesController.search);            // GET /api/recipes/search?q=&categoryId=&nationalityId=
router.get('/:id', recipesController.getOne);                // GET /api/recipes/:id

// ----------------------------------------------------------------------------
// ADMIN — requires a valid JWT (see auth.routes.js for /login)
// ----------------------------------------------------------------------------
router.get('/admin/:id', requireAdmin, recipesController.getOneAdmin); // drafts included

router.post('/', requireAdmin, uploadRecipeMedia, recipesController.create);
router.put('/:id', requireAdmin, recipesController.update);
router.delete('/:id', requireAdmin, recipesController.remove);

router.patch('/:id/publish', requireAdmin, recipesController.publish);
router.patch('/:id/unpublish', requireAdmin, recipesController.unpublish);

router.post('/:id/images', requireAdmin, uploadSingleImage, recipesController.addImage);
router.delete('/images/:imageId', requireAdmin, recipesController.removeImage);

export default router;