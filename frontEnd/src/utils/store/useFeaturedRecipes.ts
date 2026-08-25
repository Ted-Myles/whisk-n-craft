import { useEffect, useState } from 'react';
import { getRecipes } from '../recipes';
import type { Recipe } from '../types/recipes';

const CACHE_KEY = 'bp_featured_recipes_cache_v4';
const CARD_LIMIT = 10;

interface FeaturedCache {
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

        [result[i], result[j]] = [
            result[j],
            result[i]
        ];
    }

    return result;
}

/**
 * Read the previously displayed featured recipes.
 *
 * This cache is used for INSTANT rendering.
 *
 * It is not treated as the source of truth.
 * The API is still contacted afterwards.
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
 * Save the currently displayed featured recipes.
 */
function writeCache(recipes: Recipe[]): void {
    try {
        const payload: FeaturedCache = {
            recipes
        };

        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(payload)
        );

    } catch {
        /*
         * localStorage may be unavailable or full.
         *
         * The application still works because the API
         * remains the source of truth.
         */
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
             * ============================================================
             * STEP 1 — INSTANT CACHE
             * ============================================================
             *
             * If we've visited this page before, immediately display
             * whatever was previously stored.
             */
            const cached = readCache();

            if (cached && cached.length > 0) {
                setRecipes(cached);
                setLoading(false);
            }

            /*
             * ============================================================
             * STEP 2 — REVALIDATE WITH API
             * ============================================================
             *
             * getRecipes() should use the browser's HTTP cache/ETag
             * mechanism.
             *
             * If nothing changed, the server can return 304.
             *
             * If something changed, fresh recipes are returned.
             */
            try {
                const all = await getRecipes();

                if (cancelled) {
                    return;
                }

                /*
                 * ========================================================
                 * STEP 3 — FRESH DATA RECEIVED
                 * ========================================================
                 */

                const featured = shuffle(all).slice(
                    0,
                    CARD_LIMIT
                );

                /*
                 * Replace the cached UI with the latest data.
                 */
                setRecipes(featured);

                /*
                 * Save the latest featured recipes.
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
                        : new Error(
                            'Failed to load recipes'
                        );

                /*
                 * If we have cached recipes, KEEP them.
                 *
                 * The user can still use the website even if the
                 * network/API is temporarily unavailable.
                 */
                if (!cached || cached.length === 0) {
                    setError(fetchError);
                }

                console.error(
                    'Failed to refresh featured recipes:',
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