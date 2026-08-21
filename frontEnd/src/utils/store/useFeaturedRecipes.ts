import { useEffect, useState } from 'react';
import { getRecipes } from '../recipes';
import type { Recipe } from '../../types/recipe';

const CACHE_KEY = 'bp_featured_recipes_cache';
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

function readCache(): Recipe[] | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cached: FeaturedCache = JSON.parse(raw);
        if (Date.now() - cached.timestamp > CACHE_DURATION_MS) return null;
        return cached.recipes;
    } catch {
        return null; // corrupted cache — just refetch
    }
}

function writeCache(recipes: Recipe[]): void {
    try {
        const payload: FeaturedCache = { timestamp: Date.now(), recipes };
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch {
        // localStorage full/unavailable (e.g. private browsing) — fail silently,
        // the component still works, it just refetches every visit
    }
}

// Note: randomness is currently drawn from whatever getRecipes() returns
// (the 50 most recently published recipes), then shuffled client-side and
// capped at 10. That's a reasonable pool once you have more than a
// handful of recipes; for true randomness across your entire catalog,
// a backend GET /recipes/random endpoint (ORDER BY random() LIMIT 10)
// would be a cleaner long-term fix.
export function useFeaturedRecipes(): UseFeaturedRecipesResult {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            const cached = readCache();
            if (cached) {
                setRecipes(cached);
                setLoading(false);
                return;
            }

            try {
                const all = await getRecipes();
                const featured = shuffle(all).slice(0, CARD_LIMIT);
                if (!cancelled) {
                    setRecipes(featured);
                    writeCache(featured);
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load recipes'));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    return { recipes, loading, error };
}