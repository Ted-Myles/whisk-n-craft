import apiClient from './client';
import type { Category, Nationality } from '../types/recipes';

export async function getCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
}

export async function getNationalities(): Promise<Nationality[]> {
    const { data } = await apiClient.get<Nationality[]>('/nationalities');
    return data;
}