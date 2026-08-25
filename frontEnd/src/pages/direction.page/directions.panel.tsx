import type { RecipeStep } from '../../utils/types/recipes';

interface DirectionsPanelProps {
    steps: RecipeStep[];
}

export default function DirectionsPanel({ steps }: DirectionsPanelProps) {
    return (
        <div className="bp-panel bp-directions__main">
            <h2 className="bp-panel__title">Directions</h2>
            <ol className="bp-steps">
                {steps.map((step) => (
                    <li className="bp-steps__item" key={step.id}>
                        <span className="bp-steps__marker" aria-hidden="true">{step.step_number}</span>
                        <div className="bp-steps__content">
                            <p className="bp-steps__instruction">{step.instruction}</p>
                            {step.images && step.images.length > 0 && (
                                <div className="bp-steps__images">
                                    {step.images.map((img) => (
                                        <img
                                            className="ingredient-image"
                                            key={img.id}
                                            src={img.image_url}
                                            alt={img.alt_text || `Step ${step.step_number}`}
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}