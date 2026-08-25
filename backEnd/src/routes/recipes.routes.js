import express from 'express';
const router = express.Router();

import * as recipesController from '../controllers/recipes.controller.js';

import { requireAdmin } from '../middlewares/auth.middleware.js';

import {
    uploadRecipeMedia,
    uploadSingleImage
} from '../middlewares/upload.middleware.js';

import { etagCache } from '../middlewares/cache.middleware.js';


// ----------------------------------------------------------------------------
// PUBLIC
// ----------------------------------------------------------------------------

router.get(
    '/',
    etagCache(),
    recipesController.list
);

router.get(
    '/search',
    etagCache(),
    recipesController.search
);

router.get(
    '/admin/:id',
    requireAdmin,
    recipesController.getOneAdmin
);

router.get(
    '/:id',
    etagCache(),
    recipesController.getOne
);


// ----------------------------------------------------------------------------
// ADMIN
// ----------------------------------------------------------------------------

router.post(
    '/',
    requireAdmin,
    uploadRecipeMedia,
    recipesController.create
);

router.put(
    '/:id',
    requireAdmin,
    recipesController.update
);

router.delete(
    '/:id',
    requireAdmin,
    recipesController.remove
);

router.patch(
    '/:id/publish',
    requireAdmin,
    recipesController.publish
);

router.patch(
    '/:id/unpublish',
    requireAdmin,
    recipesController.unpublish
);

router.post(
    '/:id/images',
    requireAdmin,
    uploadSingleImage,
    recipesController.addImage
);

router.delete(
    '/images/:imageId',
    requireAdmin,
    recipesController.removeImage
);

export default router;