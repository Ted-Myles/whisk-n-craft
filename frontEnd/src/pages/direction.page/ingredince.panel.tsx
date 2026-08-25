import type { RecipeIngredient } from "../../types/recipe";

interface IngredientsPanelProps {
    ingredients: RecipeIngredient[];
    bakerTip?: string;
}

function formatQuantity(ingredient: RecipeIngredient): string {
    if (ingredient.quantity == null || ingredient.quantity === "") {
        return "";
    }

    const rawQuantity = ingredient.quantity;
    const numericQuantity = Number(rawQuantity);

    // If the quantity isn't a valid number, display it as-is.
    // Useful for values such as "1/2" or "1 1/2".
    if (Number.isNaN(numericQuantity)) {
        return `${rawQuantity}${ingredient.unit ? ` ${ingredient.unit}` : ""}`;
    }

    const qty = Number.isInteger(numericQuantity)
        ? String(numericQuantity)
        : numericQuantity.toFixed(2).replace(/\.?0+$/, "");

    return `${qty}${ingredient.unit ? ` ${ingredient.unit}` : ""}`;
}

export default function IngredientsPanel({
                                             ingredients,
                                             bakerTip,
                                         }: IngredientsPanelProps) {
    return (
        <aside className="bp-directions__sidebar">
            <div className="bp-panel">
                <h2 className="bp-panel__title">Ingredients</h2>

                <ul className="bp-ingredients">
                    {ingredients.map((item) => (
                        <li
                            className="bp-ingredients__item"
                            key={item.ingredient_id}
                        >
              <span className="bp-ingredients__qty">
                {formatQuantity(item)}
              </span>

                            <span className="bp-ingredients__name">
                {item.ingredient}
              </span>
                        </li>
                    ))}
                </ul>
            </div>

            {bakerTip && (
                <div className="bp-tip">
          <span
              className="bp-tip__icon"
              aria-hidden="true"
          >
            🧑‍🍳
          </span>

                    <div>
                        <p className="bp-tip__title">
                            Baker's Tip
                        </p>

                        <p className="bp-tip__text">
                            {bakerTip}
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}