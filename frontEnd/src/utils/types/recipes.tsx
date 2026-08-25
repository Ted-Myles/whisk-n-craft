// Matches the shape returned by GET /recipes, /recipes/search, /recipes/:id
// (repositories/recipes.repo.js -> getPublished / search)
export interface Recipe {
    id: number;
    title: string;
    description: string | null;
    category: string;
    nationality: string | null;
    created_at: string;
    image_url: string | null;
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

// ----------------------------------------------------------------------------
// Full recipe detail (the directions page) — extends the card-level Recipe
// with ingredients/steps. rating, times, servings, and bakerTip aren't
// returned by the backend yet; kept optional so the UI degrades gracefully
// until those columns/tables exist.
// ----------------------------------------------------------------------------
export interface RecipeIngredient {
    ingredient_id: number;
    ingredient: string;
    quantity: number | null;
    unit: string | null;
}

export interface RecipeStepImage {
    id: number;
    image_url: string;
    alt_text: string | null;
}

export interface RecipeStep {
    id: number;
    step_number: number;
    instruction: string;
    images?: RecipeStepImage[];
}

export interface RecipeDetail extends Recipe {
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
    galleryImages?: { image_url: string; alt_text?: string | null }[];
    rating?: number;
    reviewCount?: number;
    prepTimeMinutes?: number;
    bakeTimeMinutes?: number;
    servings?: number;
    bakerTip?: string;
}