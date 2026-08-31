import express from 'express';
const router = express.Router();

import * as categoriesController from '../controllers/categories.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';

// ----------------------------------------------------------------------------
// PUBLIC — no auth, anyone browsing the site needs this for filter dropdowns
// ----------------------------------------------------------------------------
router.get('/', categoriesController.list);        // GET /api/categories
router.get('/:id', categoriesController.getOne);   // GET /api/categories/:id

// ----------------------------------------------------------------------------
// ADMIN — managing the category list itself
// ----------------------------------------------------------------------------
router.post('/', requireAdmin, categoriesController.create);      // POST /api/categories
router.put('/:id', requireAdmin, categoriesController.update);    // PUT /api/categories/:id
router.delete('/:id', requireAdmin, categoriesController.remove); // DELETE /api/categories/:id

export default router;