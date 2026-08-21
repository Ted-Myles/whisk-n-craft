import pool from '../config/db.js';
import * as recipesRepo from '../repositories/recipes.repo.js';
import { uploadImage, deleteImage } from './upload.service.js';

// ----------------------------------------------------------------------------
// READS
// ----------------------------------------------------------------------------

export async function listRecipes(filters) {
    return recipesRepo.getPublished(filters);
}

export async function searchRecipes(filters) {
    return recipesRepo.search(filters);
}

// Assembles one recipe with its ingredients, steps, and images.
// includeUnpublished=true is only ever passed from the admin controller.
export async function getRecipeDetail(id, { includeUnpublished = false } = {}) {
    const recipe = await recipesRepo.getById(id, { includeUnpublished });
    if (!recipe) return null;

    const [ingredients, steps, images] = await Promise.all([
        recipesRepo.getIngredients(id),
        recipesRepo.getSteps(id),
        recipesRepo.getImages(id),
    ]);

    // attach each step's own images so the frontend doesn't have to match them up
    const stepsWithImages = steps.map((step) => ({
        ...step,
        images: images.filter((img) => img.step_id === step.id),
    }));

    return {
        ...recipe,
        ingredients,
        steps: stepsWithImages,
        heroImage: images.find((img) => img.is_primary) || null,
    };
}

// ----------------------------------------------------------------------------
// WRITES — admin only, called from admin controllers
// ----------------------------------------------------------------------------

export async function createFullRecipe(authorId, body, files) {
    const { title, description, categoryId, nationalityId, thumbnail, ingredients, steps, stepImageMap } = body;
    const uploadedUrls = [];

    const client = await pool.connect();
    try {
        // uploads happen outside the DB transaction — Supabase Storage has no
        // rollback, so on failure we clean these up manually in the catch block
        const heroFile = files?.heroImage?.[0];
        const heroUrl = heroFile
            ? await uploadImage(heroFile.buffer, heroFile.originalname, heroFile.mimetype)
            : null;
        if (heroUrl) uploadedUrls.push(heroUrl);

        const stepImageUrls = [];
        for (const file of files?.stepImages || []) {
            const url = await uploadImage(file.buffer, file.originalname, file.mimetype);
            uploadedUrls.push(url);
            stepImageUrls.push(url);
        }

        await client.query('BEGIN');

        const recipe = await recipesRepo.create(client, {
            authorId,
            categoryId,
            nationalityId: nationalityId || null,
            title,
            thumbnail,
            description,
            status: 'draft',
        });

        await recipesRepo.addIngredients(client, recipe.id, ingredients);
        const insertedSteps = await recipesRepo.addSteps(client, recipe.id, steps);

        if (heroUrl) {
            await recipesRepo.addImage(client, { recipeId: recipe.id, stepId: null, url: heroUrl, isPrimary: true, sortOrder: 0 });
        }

        for (const map of stepImageMap || []) {
            const step = insertedSteps.find((s) => s.step_number === map.stepNumber);
            const url = stepImageUrls[map.fileIndex];
            if (step && url) {
                await recipesRepo.addImage(client, { recipeId: recipe.id, stepId: step.id, url, isPrimary: false, sortOrder: 0 });
            }
        }

        await client.query('COMMIT');
        return recipe;
    } catch (err) {
        await client.query('ROLLBACK');
        await Promise.all(uploadedUrls.map(deleteImage));
        throw err;
    } finally {
        client.release();
    }
}

// Replaces core fields + fully replaces ingredients/steps (simplest
// correct behavior for an admin edit form that resends everything).
// Images are managed separately via addRecipeImage/removeRecipeImage
// so a routine text edit doesn't force re-uploading every photo.
export async function updateFullRecipe(id, body) {
    const { title, description, categoryId, thumbnail, nationalityId, ingredients, steps } = body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const recipe = await recipesRepo.updateCore(client, id, {
            categoryId,
            nationalityId: nationalityId || null,
            title,
            thumbnail,
            description,
        });
        if (!recipe) throw new Error('Recipe not found');

        await recipesRepo.clearIngredients(client, id);
        await recipesRepo.addIngredients(client, id, ingredients);

        await recipesRepo.clearSteps(client, id); // cascades any step-specific images too
        await recipesRepo.addSteps(client, id, steps);

        await client.query('COMMIT');
        return recipe;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function deleteRecipe(id) {
    return recipesRepo.remove(id);
}

export async function publishRecipe(id) {
    return recipesRepo.updateStatus(id, 'published');
}

export async function unpublishRecipe(id) {
    return recipesRepo.updateStatus(id, 'draft');
}

export async function addRecipeImage(recipeId, file, { stepId = null, isPrimary = false } = {}) {
    const url = await uploadImage(file.buffer, file.originalname, file.mimetype);
    await recipesRepo.addImage(pool, { recipeId, stepId, url, isPrimary, sortOrder: 0 });
    return url;
}

export async function removeRecipeImage(imageId) {
    const url = await recipesRepo.removeImage(imageId);
    if (url) await deleteImage(url);
}