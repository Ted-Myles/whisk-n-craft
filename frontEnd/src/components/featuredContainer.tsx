import RecipeCard from '../cards/Featured.Recipes.Card';
import { useFeaturedRecipes } from '../utils/store/useFeaturedRecipes';
import './styles/featured.css';

interface FeaturedRecipesProps {
    viewAllHref?: string;
}

export default function FeaturedRecipes({ viewAllHref = '/recipes' }: FeaturedRecipesProps) {
    const { recipes, loading, error } = useFeaturedRecipes();

    return (
        <section className="bp-featured">
            <span className="bp-featured__tab">
                <span className="bp-featured__tab-icon" aria-hidden="true">🥄</span>
                Featured Recipes
            </span>

            <div className="bp-featured__row" role="list">
                {loading &&
                    Array.from({ length: 5 }).map((_, i) => (
                        <div className="bp-featured__skeleton" key={i} aria-hidden="true" />
                    ))}

                {!loading && error && (
                    <p className="bp-featured__message">
                        Couldn't load featured recipes right now. Try refreshing the page.
                    </p>
                )}

                {!loading && !error && recipes.length === 0 && (
                    <p className="bp-featured__message">No recipes to feature yet — check back soon.</p>
                )}

                {!loading &&
                    !error &&
                    recipes.map((recipe) => (
                        <div role="listitem" key={recipe.id}>
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))}
            </div>

            <a className="bp-featured__more" href={viewAllHref}>
                More
            </a>
        </section>
    );
}