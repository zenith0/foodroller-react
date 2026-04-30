import { getNutritionFromCache } from '../api/nutrition';

export function RecipeCard({ Food, onClick }) {
  if (!Food || !Food.name) return null;

  const cached = getNutritionFromCache(Food.id);

  const handleClick = () => {
    if (onClick) onClick(Food);
  };

  return (
    <div
      className="recipe-card"
      data-testid="recipe-card"
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="recipe-card__img">
        <img src={Food.image} alt={Food.name} loading="lazy" />
        {Food.category && <span className="recipe-card__cat">{Food.category}</span>}
      </div>
      <div className="recipe-card__body">
        <div className="recipe-card__name">{Food.name}</div>
        {cached && (
          <div className="recipe-card__macros">
            <span className="recipe-macro-pill recipe-macro-pill--kcal">{Math.round(cached.kcal)} kcal</span>
            <span className="recipe-macro-pill recipe-macro-pill--protein">{Math.round(cached.protein)}g P</span>
            <span className="recipe-macro-pill recipe-macro-pill--carbs">{Math.round(cached.carbs)}g C</span>
            <span className="recipe-macro-pill recipe-macro-pill--fat">{Math.round(cached.fat)}g F</span>
          </div>
        )}
      </div>
    </div>
  );
}
