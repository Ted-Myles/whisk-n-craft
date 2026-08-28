import apiClient from './api/client.ts';

export async function getCategories() {
    const { data } = await apiClient.get('/categories');
    return data;
}

export async function getNationalities() {
    const { data } = await apiClient.get('/nationalities');
    return data;
}