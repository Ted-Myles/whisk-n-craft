import apiClient from './client';

export async function getCategories() {
    const { data } = await apiClient.get('/categories');
    return data;
}

export async function getNationalities() {
    const { data } = await apiClient.get('/nationalities');
    return data;
}