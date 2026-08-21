import type { Recipe } from '../types/recipe';
import './styles/featuredCard.css';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const {
        id,
        title,
        category,
        nationality,
        thumbnail: imageUrl
    } = recipe;
    console.log("IMAGE URL:", imageUrl);
    return (
        <a className="bp-card" href={`/recipes/${id}`}>
            <div className="bp-card__image-wrap">

                {imageUrl ? (
                    <img
                        className="bp-card__image"
                        src={imageUrl}
                        alt={title}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="bp-card__placeholder"
                        aria-hidden="true"
                    >
                        🍞
                    </div>
                )}

                <span className="bp-card__tag">
                    {category}
                </span>

            </div>

            <div className="bp-card__body">

                <h3 className="bp-card__title">
                    {title}
                </h3>

                {nationality && (
                    <p className="bp-card__meta">
                        {nationality}
                    </p>
                )}

            </div>
        </a>
    );
}