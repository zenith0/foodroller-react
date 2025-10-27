
import { mergeIngredients } from '../utils/utils';

export function ShoppingCart({ ingredientsByRecipe, onClose }) {
  // Merged ingredients for summary
  const mergedIngredients = mergeIngredients(ingredientsByRecipe);
  return (
    <div className="shopping-cart-view">
      <h2>Shopping List</h2>
      <button className="close-cart" onClick={onClose}>
        Close
      </button>
      {/* Merged ingredients summary */}
      <div className="shopping-merged-summary">
        <h3>Total Ingredients</h3>
        <ul>
          {mergedIngredients.map((item, idx) => (
            <li key={idx}>
              {item.qty % 1 === 0 ? item.qty : item.qty.toFixed(2)}
              {item.unit ? ` ${item.unit}` : ''} {item.name}
              {item.meals && item.meals.length > 0 && (
                <span>
                  ({item.meals.join(', ')})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Per-recipe breakdown as before */}
      {Object.entries(ingredientsByRecipe).map(([date, recipe]) => (
        <div key={date} className="shopping-recipe-cluster">
          <h3>
            {recipe.name ? recipe.name : "Recipe"}{" "}
            <span>
              ({date})
            </span>
          </h3>
          <ul>
            {recipe.ingredients &&
              recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ShoppingCart;
