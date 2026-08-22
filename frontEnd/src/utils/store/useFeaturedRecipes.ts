import { useEffect, useState } from 'react';
import { getRecipes } from '../recipes';
import type { Recipe } from '../../types/recipe';

const CACHE_KEY = 'bp_featured_recipes_cache_v3';
const CACHE_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const CARD_LIMIT = 10;

interface FeaturedCache {
    timestamp: number;
    recipes: Recipe[];
}

interface UseFeaturedRecipesResult {
    recipes: Recipe[];
    loading: boolean;
    error: Error | null;
}

function shuffle<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

/**
 * Reads cached recipes.
 *
 * We intentionally return the cache even if it is older than
 * CACHE_DURATION_MS.
 *
 * Why?
 *
 * The cache is used to display something immediately.
 * getRecipes() will still run afterwards and fetch fresh data.
 */
function readCache(): Recipe[] | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);

        if (!raw) {
            return null;
        }

        const cached: FeaturedCache = JSON.parse(raw);

        if (
            !cached ||
            !Array.isArray(cached.recipes)
        ) {
            return null;
        }

        return cached.recipes;
    } catch {
        return null;
    }
}

/**
 * Writes the latest recipes to localStorage.
 */
function writeCache(recipes: Recipe[]): void {
    try {
        const payload: FeaturedCache = {
            timestamp: Date.now(),
            recipes
        };

        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(payload)
        );
    } catch {
        // localStorage unavailable/full.
        // The application continues to work normally.
    }
}

export function useFeaturedRecipes(): UseFeaturedRecipesResult {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {

            /*
             * STEP 1
             * --------
             * Load cached recipes immediately.
             */
            const cached = readCache();

            if (cached && cached.length > 0) {
                setRecipes(cached);
                setLoading(false);
            }

            /*
             * STEP 2
             * --------
             * ALWAYS fetch fresh data.
             *
             * This is the important difference from your
             * previous version.
             *
             * There is NO "return" after loading the cache.
             */
            try {
                const all = await getRecipes();

                if (cancelled) {
                    return;
                }

                /*
                 * Get a random selection of recipes.
                 */
                const featured = shuffle(all).slice(
                    0,
                    CARD_LIMIT
                );

                /*
                 * STEP 3
                 * --------
                 * Replace cached recipes with fresh recipes.
                 */
                setRecipes(featured);

                /*
                 * STEP 4
                 * --------
                 * Store the new recipes.
                 */
                writeCache(featured);

                setError(null);

            } catch (err) {

                if (cancelled) {
                    return;
                }

                const fetchError =
                    err instanceof Error
                        ? err
                        : new Error('Failed to load recipes');

                /*
                 * If we already have cached recipes,
                 * keep displaying them.
                 *
                 * Only show an error state if there is
                 * absolutely no recipe data available.
                 */
                if (!cached || cached.length === 0) {
                    setError(fetchError);
                }

                console.error(
                    'Failed to fetch fresh recipes:',
                    fetchError
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        recipes,
        loading,
        error
    };
}