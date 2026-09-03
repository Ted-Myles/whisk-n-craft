import RecipeCard from '../cards/Featured.Recipes.Card';
import { useFeaturedRecipes } from '../utils/store/useFeaturedRecipes';
import styled from 'styled-components';
import './styles/featured.css';
import cake from "../assets/icons/bake3.png"

interface FeaturedRecipesProps {
    viewAllHref?: string;
}

export default function FeaturedRecipes({ viewAllHref = '/recipes' }: FeaturedRecipesProps) {
    const { recipes, loading, error } = useFeaturedRecipes();

    return (
        <section className="bp-featured">
            <span className="bp-featured__tab">
                <span className="bp-featured__tab-icon" aria-hidden="true"> <img src={cake} alt="Home" className="bread-gif" /></span>
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


         
<button className="animated-button" href="/recipes">
  <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
    ></path>
  </svg>
  <span className="text">See More Recipes</span>
  <span className="circle"></span>
  <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
    ></path>
  </svg>
</button>

            {/*<a className="bp-featured__more" href={viewAllHref}>*/}
            {/*    More*/}
            {/*</a>*/}
        </section>
    );
}