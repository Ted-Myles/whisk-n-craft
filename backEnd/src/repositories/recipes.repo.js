import pool from '../config/db.js';

// ----------------------------------------------------------------------------
// READS — public (status = 'published' only)
// ----------------------------------------------------------------------------

export async function getPublished({ categoryId, nationalityId } = {}) {
    const conditions = [`b.status = 'published'`];
    const params = [];

    if (categoryId) {
        params.push(categoryId);
        conditions.push(`b.category_id = $${params.length}`);
    }
    if (nationalityId) {
        params.push(nationalityId);
        conditions.push(`b.nationality_id = $${params.length}`);
    }

    const { rows } = await pool.query(
        `SELECT b.id, b.title, b.description, c.category, b.thumbnail, n.nationality, b.created_at
     FROM baked_goods b
     JOIN categories c ON c.category_id = b.category_id
     LEFT JOIN nationality n ON n.nationality_id = b.nationality_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY b.created_at DESC
     LIMIT 50`,
        params
    );
    return rows;
}

export async function search({ q, categoryId, nationalityId }) {
    const conditions = [`b.status = 'published'`];
    const params = [];

    if (q) {
        params.push(`%${q}%`);
        const idx = params.length;
        conditions.push(`(b.title ILIKE $${idx} OR b.description ILIKE $${idx})`);
    }
    if (categoryId) {
        params.push(categoryId);
        conditions.push(`b.category_id = $${params.length}`);
    }
    if (nationalityId) {
        params.push(nationalityId);
        conditions.push(`b.nationality_id = $${params.length}`);
    }

    const safeQ = q ? q.replace(/'/g, "''") : null;
    const orderBy = q
        ? `ORDER BY GREATEST(
         similarity(b.title, '${safeQ}') * 2,
         similarity(COALESCE(b.description, ''), '${safeQ}')
       ) DESC`
        : `ORDER BY b.created_at DESC`;

    const { rows } = await pool.query(
        `SELECT b.id, b.title, b.description, b.thumbnail, c.category, n.nationality
     FROM baked_goods b
     JOIN categories c ON c.category_id = b.category_id
     LEFT JOIN nationality n ON n.nationality_id = b.nationality_id
     WHERE ${conditions.join(' AND ')}
     ${orderBy}
     LIMIT 30`,
        params
    );
    return rows;
}

// includeUnpublished lets the admin panel view drafts; the public
// controller never sets this to true.
export async function getById(id, { includeUnpublished = false } = {}) {
    const conditions = [`b.id = $1`];
    if (!includeUnpublished) conditions.push(`b.status = 'published'`);

    const { rows } = await pool.query(
        `SELECT b.id, b.title, b.description, b.thumbnail, b.status, b.author_id,
            b.created_at, b.updated_at,
            c.category_id, c.category,
            n.nationality_id, n.nationality
     FROM baked_goods b
     JOIN categories c ON c.category_id = b.category_id
     LEFT JOIN nationality n ON n.nationality_id = b.nationality_id
     WHERE ${conditions.join(' AND ')}`,
        [id]
    );
    return rows[0] || null;
}

export async function getIngredients(recipeId) {
    const { rows } = await pool.query(
        `SELECT i.ingredient_id, i.ingredient, ri.quantity, ri.unit, ri.sort_order
     FROM recipe_ingredients ri
     JOIN ingredients_table i ON i.ingredient_id = ri.ingredient_id
     WHERE ri.recipe_id = $1
     ORDER BY ri.sort_order`,
        [recipeId]
    );
    return rows;
}

export async function getSteps(recipeId) {
    const { rows } = await pool.query(
        `SELECT id, step_number, instruction
     FROM recipe_steps
     WHERE recipe_id = $1
     ORDER BY step_number`,
        [recipeId]
    );
    return rows;
}

export async function getImages(recipeId) {
    const { rows } = await pool.query(
        `SELECT id, step_id, image_url, alt_text, is_primary, sort_order
     FROM recipe_images
     WHERE recipe_id = $1
     ORDER BY step_id NULLS FIRST, sort_order`,
        [recipeId]
    );
    return rows;
}

// ----------------------------------------------------------------------------
// WRITES — all take `client`, not `pool`, so callers can wrap them in a
// shared transaction (see recipes.service.js: createFullRecipe / updateFullRecipe)
// ----------------------------------------------------------------------------

export async function create(client, { authorId, categoryId, nationalityId, title, description, status = 'draft' }) {
    const { rows } = await client.query(
        `INSERT INTO baked_goods (author_id, category_id, nationality_id, title, description, status)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [authorId, categoryId, nationalityId, title, description, status]
    );
    return rows[0];
}

export async function updateCore(client, id, { categoryId, nationalityId, title, description }) {
    const { rows } = await client.query(
        `UPDATE baked_goods
     SET category_id = $1, nationality_id = $2, title = $3, description = $4
     WHERE id = $5
     RETURNING *`,
        [categoryId, nationalityId, title, description, id]
    );
    return rows[0];
}

export async function updateStatus(id, status) {
    const { rows } = await pool.query(
        `UPDATE baked_goods SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
    );
    return rows[0];
}

export async function remove(id) {
    // ON DELETE CASCADE on recipe_ingredients / recipe_steps / recipe_images
    // handles the child rows automatically.
    await pool.query(`DELETE FROM baked_goods WHERE id = $1`, [id]);
}

export async function addIngredients(client, recipeId, ingredients) {
    for (const ing of ingredients) {
        await client.query(
            `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, sort_order)
       VALUES ($1,$2,$3,$4,$5)`,
            [recipeId, ing.ingredientId, ing.quantity, ing.unit, ing.sortOrder ?? 0]
        );
    }
}

export async function clearIngredients(client, recipeId) {
    await client.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [recipeId]);
}

export async function addSteps(client, recipeId, steps) {
    const inserted = [];
    for (const step of steps) {
        const { rows } = await client.query(
            `INSERT INTO recipe_steps (recipe_id, step_number, instruction)
       VALUES ($1,$2,$3) RETURNING id, step_number`,
            [recipeId, step.stepNumber, step.instruction]
        );
        inserted.push(rows[0]);
    }
    return inserted;
}

export async function clearSteps(client, recipeId) {
    // recipe_images rows pointing at these steps cascade-delete automatically
    await client.query(`DELETE FROM recipe_steps WHERE recipe_id = $1`, [recipeId]);
}

export async function addImage(client, { recipeId, stepId, url, altText = null, isPrimary = false, sortOrder = 0 }) {
    await client.query(
        `INSERT INTO recipe_images (recipe_id, step_id, image_url, alt_text, is_primary, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6)`,
        [recipeId, stepId, url, altText, isPrimary, sortOrder]
    );
}

export async function removeImage(imageId) {
    const { rows } = await pool.query(
        `DELETE FROM recipe_images WHERE id = $1 RETURNING image_url`,
        [imageId]
    );
    return rows[0]?.image_url || null;
}