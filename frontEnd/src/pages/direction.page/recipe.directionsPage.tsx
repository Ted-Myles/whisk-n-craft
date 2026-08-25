import { useEffect, useMemo, useState } from 'react';
import type { RecipeDetail } from '../../utils/types/recipes';
import IngredientsPanel from './ingredince.panel';
import DirectionsPanel from './directions.panel';
import './recipe.directions.css';
import LoadingScreen from '../../components/loadingScreen';
import Navbar from "../../components/navbar";

interface RecipeDirectionsPageProps {
    recipe: RecipeDetail | undefined;
}

const LOADING_DURATION = 200;

function StarRating({ rating }: { rating: number }) {
    const rounded = Math.max(0, Math.min(5, Math.round(rating)));

    return (
        <span
            className="bp-rating__stars"
            aria-label={`${rounded} out of 5 stars`}
        >
            {Array.from({ length: 5 }, (_, i) => (
                <span
                    key={i}
                    className={i < rounded ? 'is-filled' : ''}
                    aria-hidden="true"
                >
                    ★
                </span>
            ))}
        </span>
    );
}

export default function RecipeDirectionsPage({
                                                 recipe
                                             }: RecipeDirectionsPageProps) {
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    /*
     * Minimum loading-screen duration.
     */
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setShowLoading(false);
        }, LOADING_DURATION);

        return () => window.clearTimeout(timer);
    }, []);

    /*
     * Build gallery only when recipe changes.
     */
    const gallery = useMemo(() => {
        if (!recipe) {
            return [];
        }

        const images = recipe.galleryImages ?? [];

        if (!recipe.image_url) {
            return images;
        }

        return [
            {
                image_url: recipe.image_url,
                alt_text: recipe.title
            },
            ...images.filter(
                (image) =>
                    image.image_url !== recipe.image_url
            )
        ];
    }, [recipe]);

    /*
     * Set the initial active image when the recipe/gallery changes.
     */
    useEffect(() => {
        setActiveImage(
            gallery[0]?.image_url ?? null
        );
    }, [gallery]);

    /*
     * Keep the loading screen until both:
     * - the minimum duration has elapsed
     * - recipe data exists
     */
    if (!recipe || showLoading) {
        return <LoadingScreen />;
    }

    const {
        title,
        description,
        rating,
        reviewCount,
        prepTimeMinutes,
        bakeTimeMinutes,
        servings,
        ingredients,
        bakerTip,
        steps
    } = recipe;

    return (
        <div>
            <Navbar/>

        <article className="bp-recipe">


            {/* Hero */}
            <div className="bp-hero">

                {/* Gallery */}
                <div className="bp-hero__gallery">

                    {activeImage ? (
                        <img
                            className="bp-hero__main-image"
                            src={activeImage}
                            alt={title}
                            fetchPriority="high"
                            decoding="async"
                        />
                    ) : (
                        <div
                            className="bp-hero__placeholder"
                            aria-hidden="true"
                        >
                            🍞
                        </div>
                    )}

                    {gallery.length > 1 && (
                        <div className="bp-hero__thumbs">
                            {gallery.map((img, index) => {
                                const isActive =
                                    img.image_url === activeImage;

                                return (
                                    <button
                                        key={`${img.image_url}-${index}`}
                                        type="button"
                                        className={`bp-hero__thumb ${
                                            isActive
                                                ? 'is-active'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setActiveImage(
                                                img.image_url
                                            )
                                        }
                                        aria-label={`Show image ${
                                            index + 1
                                        } of ${gallery.length}`}
                                        aria-pressed={isActive}
                                    >
                                        <img
                                            src={img.image_url}
                                            alt={
                                                img.alt_text ??
                                                `${title} image ${
                                                    index + 1
                                                }`
                                            }
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                </div>

                {/* Recipe information */}
                <div className="bp-hero__info">

                    <h1 className="bp-hero__title">
                        {title}
                    </h1>

                    {rating != null && (
                        <div className="bp-rating">
                            <StarRating rating={rating} />

                            {reviewCount != null && (
                                <span className="bp-rating__count">
                                    ({reviewCount})
                                </span>
                            )}
                        </div>
                    )}

                    {description && (
                        <p className="bp-hero__description">
                            {description}
                        </p>
                    )}

                    {(
                        prepTimeMinutes != null ||
                        bakeTimeMinutes != null ||
                        servings != null
                    ) && (
                        <div className="bp-meta">

                            {prepTimeMinutes != null && (
                                <div className="bp-meta__item">
                                    <span
                                        className="bp-meta__icon"
                                        aria-hidden="true"
                                    >
                                        ⏱
                                    </span>

                                    <span className="bp-meta__label">
                                        Prep Time
                                    </span>

                                    <span className="bp-meta__value">
                                        {prepTimeMinutes} mins
                                    </span>
                                </div>
                            )}

                            {bakeTimeMinutes != null && (
                                <div className="bp-meta__item">
                                    <span
                                        className="bp-meta__icon"
                                        aria-hidden="true"
                                    >
                                        ⏲
                                    </span>

                                    <span className="bp-meta__label">
                                        Bake Time
                                    </span>

                                    <span className="bp-meta__value">
                                        {bakeTimeMinutes} mins
                                    </span>
                                </div>
                            )}

                            {servings != null && (
                                <div className="bp-meta__item">
                                    <span
                                        className="bp-meta__icon"
                                        aria-hidden="true"
                                    >
                                        🍽
                                    </span>

                                    <span className="bp-meta__label">
                                        Servings
                                    </span>

                                    <span className="bp-meta__value">
                                        {servings} slices
                                    </span>
                                </div>
                            )}

                        </div>
                    )}

                    <div className="bp-actions">

                        <button
                            type="button"
                            className={`bp-actions__save ${
                                saved ? 'is-saved' : ''
                            }`}
                            onClick={() =>
                                setSaved((current) => !current)
                            }
                            aria-pressed={saved}
                        >
                            <span aria-hidden="true">
                                {saved ? '♥' : '♡'}
                            </span>

                            {saved
                                ? 'Saved'
                                : 'Save Recipe'}
                        </button>

                        <button
                            type="button"
                            className="bp-actions__share"
                        >
                            <span aria-hidden="true">
                                ↗
                            </span>

                            Share
                        </button>

                    </div>

                </div>
            </div>

            {/* Recipe content */}
            <div className="bp-directions">

                <IngredientsPanel
                    ingredients={ingredients}
                    bakerTip={bakerTip}
                />

                <DirectionsPanel
                    steps={steps}
                />

            </div>

        </article>
        </div>
    );
}