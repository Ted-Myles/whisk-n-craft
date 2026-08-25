import { Link } from 'react-router-dom';
import type { Recipe } from '../utils/types/recipes';
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

    return (
        <Link className="bp-card" to={`/recipes/${id}`}>
            <div className="bp-card__image-wrap">

                {imageUrl ? (
                    <img
                        className="bp-card__image"
                        src={imageUrl}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="high"
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
        </Link>
    );
}