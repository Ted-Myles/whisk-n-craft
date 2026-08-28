import apiClient from './api/client.ts';

// Public reads only — this frontend never creates, edits, or deletes
// recipes. All of that lives in the separate admin dashboard.

export async function getRecipes({ categoryId, nationalityId } = {}) {
    const { data } = await apiClient.get('/recipes', { params: { categoryId, nationalityId } });
    return data;
}

export async function searchRecipes({ q, categoryId, nationalityId } = {}) {
    const { data } = await apiClient.get('/recipes/search', { params: { q, categoryId, nationalityId } });
    return data;
}

export async function getRecipeById(id) {
    const { data } = await apiClient.get(`/recipes/${id}`);
    return data;
}