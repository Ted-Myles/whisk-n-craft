import * as categoriesRepo from '../repositories/categories.repo.js';

export async function listCategories() {
    return categoriesRepo.getAll();
}

export async function getCategory(id) {
    return categoriesRepo.getById(id);
}

export async function createCategory(category) {
    const trimmed = (category || '').trim();
    if (!trimmed) {
        const err = new Error('Category name is required.');
        err.status = 400;
        throw err;
    }
    return categoriesRepo.create(trimmed);
}

export async function updateCategory(id, category) {
    const trimmed = (category || '').trim();
    if (!trimmed) {
        const err = new Error('Category name is required.');
        err.status = 400;
        throw err;
    }
    const updated = await categoriesRepo.update(id, trimmed);
    if (!updated) {
        const err = new Error('Category not found.');
        err.status = 404;
        throw err;
    }
    return updated;
}

export async function deleteCategory(id) {
    return categoriesRepo.remove(id);
}