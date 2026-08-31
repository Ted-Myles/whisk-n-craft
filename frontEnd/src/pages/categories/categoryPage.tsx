import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategories } from "../../utils/api/lookups";
import { getRecipes } from "../../utils/recipes";
import type { Category, Recipe } from "../../utils/types/recipes";
import RecipeCard from "../../cards/Featured.Recipes.Card"; // adjust to wherever this currently lives
import "../styles/CategoryPage.css";

export default function CategoryPage() {
    const { categoryName } = useParams<{ categoryName: string }>();

    const [category, setCategory] = useState<Category | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!categoryName) return;
        let cancelled = false;

        async function load() {
            setLoading(true);
            setNotFound(false);
            setError(null);

            try {
                // categories come from the backend by numeric id; the hardcoded
                // icon cards only carry a name, so match on that first.
                const allCategories = await getCategories();
                const match = allCategories.find(
                    (c) => c.category.toLowerCase() === categoryName.toLowerCase()
                );

                if (!match) {
                    if (!cancelled) setNotFound(true);
                    return;
                }

                const categoryRecipes = await getRecipes({ categoryId: match.category_id });
                if (!cancelled) {
                    setCategory(match);
                    setRecipes(categoryRecipes);
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err : new Error("Failed to load category"));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [categoryName]);

    if (loading) return <p className="bp-category-page__message">Loading…</p>;

    if (notFound) {
        return (
            <div className="bp-category-page__message">
                <p>We don't have a "{categoryName}" category yet.</p>
                <Link to="/">Back to home</Link>
            </div>
        );
    }

    if (error) {
        return <p className="bp-category-page__message">Couldn't load these recipes. Try again shortly.</p>;
    }

    return (
        <section className="bp-category-page">
            <h1 className="bp-category-page__title">{category?.category}</h1>

            {recipes.length === 0 ? (
                <p className="bp-category-page__message">No recipes in this category yet — check back soon.</p>
            ) : (
                <div className="bp-category-page__grid">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </section>
    );
}