import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../../utils/recipes';
import type { RecipeDetail } from '../../utils/types/recipes';
import RecipeDirectionsPage from './recipe.directionsPage';

export default function RecipeDetailRoute() {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<RecipeDetail>();
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        getRecipeById(id)
            .then((data) => {
                if (!cancelled) setRecipe(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load recipe'));
            });

        return () => { cancelled = true; };
    }, [id]);

    if (error) {
        return <p className="bp-loading">Couldn't load this recipe. Try going back and selecting it again.</p>;
    }

    // RecipeDirectionsPage already guards against recipe being undefined
    // and shows its own "Loading recipe…" state — no need to duplicate that here.
    return <RecipeDirectionsPage recipe={recipe} />;
}