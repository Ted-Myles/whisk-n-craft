import pool from '../config/db.js';

export async function getAll() {
    const { rows } = await pool.query(
        `SELECT category_id, category FROM categories ORDER BY category`
    );
    return rows;
}

export async function getById(id) {
    const { rows } = await pool.query(
        `SELECT category_id, category FROM categories WHERE category_id = $1`,
        [id]
    );
    return rows[0] || null;
}

export async function create(category) {
    const { rows } = await pool.query(
        `INSERT INTO categories (category) VALUES ($1) RETURNING category_id, category`,
        [category]
    );
    return rows[0];
}

export async function update(id, category) {
    const { rows } = await pool.query(
        `UPDATE categories SET category = $1 WHERE category_id = $2 RETURNING category_id, category`,
        [category, id]
    );
    return rows[0] || null;
}

export async function remove(id) {
    await pool.query(`DELETE FROM categories WHERE category_id = $1`, [id]);
}