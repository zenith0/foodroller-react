import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeCard } from '../components/RecipeCard';

jest.mock('../api/nutrition', () => ({
  getNutritionFromCache: jest.fn(() => null),
}));

import { getNutritionFromCache } from '../api/nutrition';

const meal = { id: 'meal-1', name: 'Chicken Tikka', image: 'chicken.jpg', category: 'Chicken' };

describe('RecipeCard', () => {
  beforeEach(() => {
    getNutritionFromCache.mockReturnValue(null);
  });

  it('renders name and category', () => {
    render(<RecipeCard Food={meal} />);
    expect(screen.getByText('Chicken Tikka')).toBeInTheDocument();
    expect(screen.getByText('Chicken')).toBeInTheDocument();
  });

  it('renders image with correct src and alt', () => {
    render(<RecipeCard Food={meal} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'chicken.jpg');
    expect(img).toHaveAttribute('alt', 'Chicken Tikka');
  });

  it('calls onClick with the meal object', () => {
    const onClick = jest.fn();
    render(<RecipeCard Food={meal} onClick={onClick} />);
    fireEvent.click(screen.getByText('Chicken Tikka'));
    expect(onClick).toHaveBeenCalledWith(meal);
  });

  it('does not crash without onClick', () => {
    render(<RecipeCard Food={meal} />);
  });

  it('returns null when Food is missing', () => {
    const { container } = render(<RecipeCard />);
    expect(container).toBeEmptyDOMElement();
  });

  it('omits category paragraph when category is absent', () => {
    render(<RecipeCard Food={{ name: 'Mystery Dish', image: 'img.jpg' }} />);
    expect(screen.queryByRole('paragraph')).toBeNull();
  });

  it('shows no macro badges when nutrition not cached', () => {
    render(<RecipeCard Food={meal} />);
    expect(screen.queryByText(/kcal/)).toBeNull();
  });

  it('shows macro badges when nutrition is cached', () => {
    getNutritionFromCache.mockReturnValue({ kcal: 350, protein: 28, carbs: 42, fat: 11, fiber: 3 });
    render(<RecipeCard Food={meal} />);
    expect(screen.getByText('350 kcal')).toBeInTheDocument();
    expect(screen.getByText('28g P')).toBeInTheDocument();
    expect(screen.getByText('42g C')).toBeInTheDocument();
    expect(screen.getByText('11g F')).toBeInTheDocument();
  });

  it('rounds macro values', () => {
    getNutritionFromCache.mockReturnValue({ kcal: 349.7, protein: 27.3, carbs: 42.1, fat: 10.9, fiber: 2.8 });
    render(<RecipeCard Food={meal} />);
    expect(screen.getByText('350 kcal')).toBeInTheDocument();
    expect(screen.getByText('27g P')).toBeInTheDocument();
  });
});
