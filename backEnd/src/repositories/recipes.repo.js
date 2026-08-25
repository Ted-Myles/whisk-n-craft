import pool from '../config/db.js';

// ----------------------------------------------------------------------------
// READS — PUBLIC
// ----------------------------------------------------------------------------

export async function getPublished({
                                       categoryId,
                                       nationalityId
                                   } = {}) {
    const conditions = ['b.status = $1'];
    const params = ['published'];

    if (categoryId) {
        params.push(categoryId);
        conditions.push(
            `b.category_id = $${params.length}`
        );
    }

    if (nationalityId) {
        params.push(nationalityId);
        conditions.push(
            `b.nationality_id = $${params.length}`
        );
    }

    const { rows } = await pool.query(
        `
        SELECT
            b.id,
            b.title,
            b.description,
            c.category,
            b.thumbnail,
            n.nationality,
            b.created_at
        FROM baked_goods b
        JOIN categories c
            ON c.category_id = b.category_id
        LEFT JOIN nationality n
            ON n.nationality_id = b.nationality_id
        WHERE ${conditions.join(' AND ')}
        ORDER BY b.created_at DESC
        LIMIT 50
        `,
        params
    );

    return rows;
}


export async function search({
                                 q,
                                 categoryId,
                                 nationalityId
                             } = {}) {
    const conditions = ['b.status = $1'];
    const params = ['published'];

    if (q) {
        params.push(`%${q}%`);

        const searchIndex = params.length;

        conditions.push(
            `(b.title ILIKE $${searchIndex}
              OR b.description ILIKE $${searchIndex})`
        );
    }

    if (categoryId) {
        params.push(categoryId);

        conditions.push(
            `b.category_id = $${params.length}`
        );
    }

    if (nationalityId) {
        params.push(nationalityId);

        conditions.push(
            `b.nationality_id = $${params.length}`
        );
    }

    const orderBy = q
        ? 'ORDER BY b.title ASC'
        : 'ORDER BY b.created_at DESC';

    const { rows } = await pool.query(
        `
        SELECT
            b.id,
            b.title,
            b.description,
            b.thumbnail,
            c.category,
            n.nationality
        FROM baked_goods b
        JOIN categories c
            ON c.category_id = b.category_id
        LEFT JOIN nationality n
            ON n.nationality_id = b.nationality_id
        WHERE ${conditions.join(' AND ')}
        ${orderBy}
        LIMIT 30
        `,
        params
    );

    return rows;
}


// ----------------------------------------------------------------------------
// RECIPE DETAIL
// ----------------------------------------------------------------------------

export async function getRecipeDetail(
    id,
    { includeUnpublished = false } = {}
) {
    const statusCondition = includeUnpublished
        ? ''
        : `AND b.status = 'published'`;

    const { rows } = await pool.query(
        `
        SELECT
            b.id,
            b.title,
            b.description,
            b.thumbnail,
            b.status,
            b.author_id,
            b.created_at,
            b.updated_at,

            c.category_id,
            c.category,

            n.nationality_id,
            n.nationality,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'ingredient_id', i.ingredient_id,
                            'ingredient', i.ingredient,
                            'quantity', ri.quantity,
                            'unit', ri.unit,
                            'sort_order', ri.sort_order
                        )
                        ORDER BY ri.sort_order
                    )
                    FROM recipe_ingredients ri
                    JOIN ingredients_table i
                        ON i.ingredient_id = ri.ingredient_id
                    WHERE ri.recipe_id = b.id
                ),
                '[]'::json
            ) AS ingredients,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', s.id,
                            'step_number', s.step_number,
                            'instruction', s.instruction,
                            'images',
                            COALESCE(
                                (
                                    SELECT json_agg(
                                        json_build_object(
                                            'id', si.id,
                                            'step_id', si.step_id,
                                            'image_url', si.image_url,
                                            'alt_text', si.alt_text,
                                            'is_primary', si.is_primary,
                                            'sort_order', si.sort_order
                                        )
                                        ORDER BY si.sort_order
                                    )
                                    FROM recipe_images si
                                    WHERE si.step_id = s.id
                                ),
                                '[]'::json
                            )
                        )
                        ORDER BY s.step_number
                    )
                    FROM recipe_steps s
                    WHERE s.recipe_id = b.id
                ),
                '[]'::json
            ) AS steps,

            (
                SELECT json_build_object(
                    'id', hi.id,
                    'step_id', hi.step_id,
                    'image_url', hi.image_url,
                    'alt_text', hi.alt_text,
                    'is_primary', hi.is_primary,
                    'sort_order', hi.sort_order
                )
                FROM recipe_images hi
                WHERE hi.recipe_id = b.id
                  AND hi.is_primary = true
                ORDER BY hi.sort_order
                LIMIT 1
            ) AS "heroImage"

        FROM baked_goods b

        JOIN categories c
            ON c.category_id = b.category_id

        LEFT JOIN nationality n
            ON n.nationality_id = b.nationality_id

        WHERE b.id = $1
        ${statusCondition}

        LIMIT 1
        `,
        [id]
    );

    if (!rows[0]) {
        return null;
    }

    const recipe = rows[0];

    return {
        ...recipe,
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
        heroImage: recipe.heroImage || null,
    };
}


// ----------------------------------------------------------------------------
// WRITES
// ----------------------------------------------------------------------------

export async function create(
    client,
    {
        authorId,
        categoryId,
        nationalityId,
        title,
        description,
        status = 'draft'
    }
) {
    const { rows } = await client.query(
        `
        INSERT INTO baked_goods (
            author_id,
            category_id,
            nationality_id,
            title,
            description,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            authorId,
            categoryId,
            nationalityId,
            title,
            description,
            status
        ]
    );

    return rows[0];
}


export async function updateCore(
    client,
    id,
    {
        categoryId,
        nationalityId,
        title,
        description,
        thumbnail
    }
) {
    const { rows } = await client.query(
        `
        UPDATE baked_goods
        SET
            category_id = $1,
            nationality_id = $2,
            title = $3,
            description = $4,
            thumbnail = $5
        WHERE id = $6
        RETURNING *
        `,
        [
            categoryId,
            nationalityId,
            title,
            description,
            thumbnail,
            id
        ]
    );

    return rows[0];
}


export async function updateStatus(id, status) {
    const { rows } = await pool.query(
        `
        UPDATE baked_goods
        SET status = $1
        WHERE id = $2
        RETURNING *
        `,
        [status, id]
    );

    return rows[0];
}


export async function remove(id) {
    await pool.query(
        `
        DELETE FROM baked_goods
        WHERE id = $1
        `,
        [id]
    );
}


export async function addIngredients(
    client,
    recipeId,
    ingredients
) {
    for (const ingredient of ingredients) {
        await client.query(
            `
            INSERT INTO recipe_ingredients (
                recipe_id,
                ingredient_id,
                quantity,
                unit,
                sort_order
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                recipeId,
                ingredient.ingredientId,
                ingredient.quantity,
                ingredient.unit,
                ingredient.sortOrder ?? 0
            ]
        );
    }
}


export async function clearIngredients(
    client,
    recipeId
) {
    await client.query(
        `
        DELETE FROM recipe_ingredients
        WHERE recipe_id = $1
        `,
        [recipeId]
    );
}


export async function addSteps(
    client,
    recipeId,
    steps
) {
    const inserted = [];

    for (const step of steps) {
        const { rows } = await client.query(
            `
            INSERT INTO recipe_steps (
                recipe_id,
                step_number,
                instruction
            )
            VALUES ($1, $2, $3)
            RETURNING id, step_number
            `,
            [
                recipeId,
                step.stepNumber,
                step.instruction
            ]
        );

        inserted.push(rows[0]);
    }

    return inserted;
}


export async function clearSteps(
    client,
    recipeId
) {
    await client.query(
        `
        DELETE FROM recipe_steps
        WHERE recipe_id = $1
        `,
        [recipeId]
    );
}


export async function addImage(
    client,
    {
        recipeId,
        stepId,
        url,
        altText = null,
        isPrimary = false,
        sortOrder = 0
    }
) {
    await client.query(
        `
        INSERT INTO recipe_images (
            recipe_id,
            step_id,
            image_url,
            alt_text,
            is_primary,
            sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
            recipeId,
            stepId,
            url,
            altText,
            isPrimary,
            sortOrder
        ]
    );
}


export async function removeImage(imageId) {
    const { rows } = await pool.query(
        `
        DELETE FROM recipe_images
        WHERE id = $1
        RETURNING image_url
        `,
        [imageId]
    );

    return rows[0]?.image_url || null;
}