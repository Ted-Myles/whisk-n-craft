// Matches the shape returned by:
// GET /recipes
// GET /recipes/search
// GET /recipes/:id
//
// Source:
// repositories/recipes.repo.js -> getPublished / search

export interface Recipe {
    id: number;
    title: string;
    description: string | null;

    category: string;
    nationality: string | null;

    created_at: string;

    // Public URL to the recipe thumbnail stored in Supabase Storage.
    // Example:
    // https://pijbtqycclbhqajkfuqw.supabase.co/storage/v1/object/public/bakers_paradise_images/piie.jpg
    thumbnail: string | null;

    // Alternative text for accessibility.
    image_alt: string | null;
}

export interface Category {
    category_id: number;
    category: string;
}

export interface Nationality {
    nationality_id: number;
    nationality: string;
}

export interface RecipeFilters {
    categoryId?: number | string;
    nationalityId?: number | string;
}

export interface RecipeSearchFilters extends RecipeFilters {
    q?: string;
}