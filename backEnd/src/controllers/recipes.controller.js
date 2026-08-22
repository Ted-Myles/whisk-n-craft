import * as recipesService from '../services/recipes.service.js';

// ----------------------------------------------------------------------------
// PUBLIC
// ----------------------------------------------------------------------------

export async function list(req, res, next) {
    try {
        const { categoryId, nationalityId } = req.query;
        const recipes = await recipesService.listRecipes({ categoryId, nationalityId });
        res.json(recipes);
    } catch (err) { next(err); }
}


export async function search(req, res, next) {
    try {
        const { q, categoryId, nationalityId } = req.query;
        const recipes = await recipesService.searchRecipes({ q, categoryId, nationalityId });
        res.json(recipes);
    } catch (err) { next(err); }
}

export async function getOne(req, res, next) {
    try {
        const recipe = await recipesService.getRecipeDetail(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) { next(err); }
}

// ----------------------------------------------------------------------------
// ADMIN — mounted behind requireAdmin in routes/recipes.routes.js
// ----------------------------------------------------------------------------

export async function getOneAdmin(req, res, next) {
    try {
        const recipe = await recipesService.getRecipeDetail(req.params.id, { includeUnpublished: true });
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) { next(err); }
}

function parseRecipeBody(req) {
    return {
        ...req.body,
        ingredients: JSON.parse(req.body.ingredients || '[]'),
        steps: JSON.parse(req.body.steps || '[]'),
        stepImageMap: req.body.stepImageMap ? JSON.parse(req.body.stepImageMap) : [],
    };
}

export async function create(req, res, next) {
    try {
        const body = parseRecipeBody(req);
        const recipe = await recipesService.createFullRecipe(req.user.id, body, req.files);
        res.status(201).json(recipe);
    } catch (err) { next(err); }
}

export async function update(req, res, next) {
    try {
        const body = parseRecipeBody(req);
        const recipe = await recipesService.updateFullRecipe(req.params.id, body);
        res.json(recipe);
    } catch (err) { next(err); }
}

export async function remove(req, res, next) {
    try {
        await recipesService.deleteRecipe(req.params.id);
        res.status(204).send();
    } catch (err) { next(err); }
}

export async function publish(req, res, next) {
    try {
        const recipe = await recipesService.publishRecipe(req.params.id);
        res.json(recipe);
    } catch (err) { next(err); }
}

export async function unpublish(req, res, next) {
    try {
        const recipe = await recipesService.unpublishRecipe(req.params.id);
        res.json(recipe);
    } catch (err) { next(err); }
}

export async function addImage(req, res, next) {
    try {
        const file = req.files?.image?.[0];
        if (!file) return res.status(400).json({ error: 'No image file provided' });
        const url = await recipesService.addRecipeImage(req.params.id, file, {
            stepId: req.body.stepId || null,
            isPrimary: req.body.isPrimary === 'true',
        });
        res.status(201).json({ url });
    } catch (err) { next(err); }
}

export async function removeImage(req, res, next) {
    try {
        await recipesService.removeRecipeImage(req.params.imageId);
        res.status(204).send();
    } catch (err) { next(err); }
}