import pool from '../config/db.js';
import * as recipesRepo from '../repositories/recipes.repo.js';
import {
    uploadImage,
    deleteImage
} from './upload.service.js';

// ----------------------------------------------------------------------------
// READS
// ----------------------------------------------------------------------------

export async function listRecipes(filters) {
    return recipesRepo.getPublished(filters);
}


export async function searchRecipes(filters) {
    return recipesRepo.search(filters);
}


export async function getRecipeDetail(
    id,
    { includeUnpublished = false } = {}
) {
    return recipesRepo.getRecipeDetail(id, {
        includeUnpublished
    });
}


// ----------------------------------------------------------------------------
// WRITES — ADMIN ONLY
// ----------------------------------------------------------------------------

export async function createFullRecipe(
    authorId,
    body,
    files
) {
    const {
        title,
        description,
        categoryId,
        nationalityId,
        thumbnail,
        ingredients,
        steps,
        stepImageMap
    } = body;

    const uploadedUrls = [];

    const client = await pool.connect();

    try {
        // --------------------------------------------------------
        // Upload hero image
        // --------------------------------------------------------

        const heroFile =
            files?.heroImage?.[0];

        const heroUrl = heroFile
            ? await uploadImage(
                heroFile.buffer,
                heroFile.originalname,
                heroFile.mimetype
            )
            : null;

        if (heroUrl) {
            uploadedUrls.push(heroUrl);
        }

        // --------------------------------------------------------
        // Upload step images
        // --------------------------------------------------------

        const stepImageUrls = [];

        for (
            const file
            of files?.stepImages || []
            ) {
            const url = await uploadImage(
                file.buffer,
                file.originalname,
                file.mimetype
            );

            uploadedUrls.push(url);
            stepImageUrls.push(url);
        }

        // --------------------------------------------------------
        // Database transaction
        // --------------------------------------------------------

        await client.query('BEGIN');

        const recipe =
            await recipesRepo.create(
                client,
                {
                    authorId,
                    categoryId,
                    nationalityId:
                        nationalityId || null,
                    title,
                    description,
                    status: 'draft'
                }
            );

        await recipesRepo.addIngredients(
            client,
            recipe.id,
            ingredients
        );

        const insertedSteps =
            await recipesRepo.addSteps(
                client,
                recipe.id,
                steps
            );

        // --------------------------------------------------------
        // Hero image
        // --------------------------------------------------------

        if (heroUrl) {
            await recipesRepo.addImage(
                client,
                {
                    recipeId: recipe.id,
                    stepId: null,
                    url: heroUrl,
                    isPrimary: true,
                    sortOrder: 0
                }
            );
        }

        // --------------------------------------------------------
        // Step images
        // --------------------------------------------------------

        for (
            const map
            of stepImageMap || []
            ) {
            const step =
                insertedSteps.find(
                    (item) =>
                        item.step_number ===
                        map.stepNumber
                );

            const url =
                stepImageUrls[
                    map.fileIndex
                    ];

            if (step && url) {
                await recipesRepo.addImage(
                    client,
                    {
                        recipeId:
                        recipe.id,
                        stepId:
                        step.id,
                        url,
                        isPrimary: false,
                        sortOrder: 0
                    }
                );
            }
        }

        await client.query('COMMIT');

        return recipe;
    } catch (err) {
        await client.query('ROLLBACK');

        await Promise.all(
            uploadedUrls.map(deleteImage)
        );

        throw err;
    } finally {
        client.release();
    }
}


// ----------------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------------

export async function updateFullRecipe(
    id,
    body
) {
    const {
        title,
        description,
        categoryId,
        thumbnail,
        nationalityId,
        ingredients,
        steps
    } = body;

    const client =
        await pool.connect();

    try {
        await client.query('BEGIN');

        const recipe =
            await recipesRepo.updateCore(
                client,
                id,
                {
                    categoryId,
                    nationalityId:
                        nationalityId || null,
                    title,
                    description,
                    thumbnail
                }
            );

        if (!recipe) {
            throw new Error(
                'Recipe not found'
            );
        }

        await recipesRepo.clearIngredients(
            client,
            id
        );

        await recipesRepo.addIngredients(
            client,
            id,
            ingredients
        );

        await recipesRepo.clearSteps(
            client,
            id
        );

        await recipesRepo.addSteps(
            client,
            id,
            steps
        );

        await client.query('COMMIT');

        return recipe;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}


// ----------------------------------------------------------------------------
// OTHER OPERATIONS
// ----------------------------------------------------------------------------

export async function deleteRecipe(id) {
    return recipesRepo.remove(id);
}


export async function publishRecipe(id) {
    return recipesRepo.updateStatus(
        id,
        'published'
    );
}


export async function unpublishRecipe(id) {
    return recipesRepo.updateStatus(
        id,
        'draft'
    );
}


export async function addRecipeImage(
    recipeId,
    file,
    {
        stepId = null,
        isPrimary = false
    } = {}
) {
    const url = await uploadImage(
        file.buffer,
        file.originalname,
        file.mimetype
    );

    await recipesRepo.addImage(
        pool,
        {
            recipeId,
            stepId,
            url,
            isPrimary,
            sortOrder: 0
        }
    );

    return url;
}


export async function removeRecipeImage(
    imageId
) {
    const url =
        await recipesRepo.removeImage(
            imageId
        );

    if (url) {
        await deleteImage(url);
    }
}