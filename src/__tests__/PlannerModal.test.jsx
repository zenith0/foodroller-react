import { render, screen, fireEvent } from '@testing-library/react';
import PlannerModal from '../components/PlannerModal';
import { generateMealPlan } from '../api/planner';

jest.mock('../api/planner', () => ({
  generateMealPlan: jest.fn(),
}));

const macroProfile = { kcal: 2000, protein: 150, carbs: 200, fat: 60 };

const SLOTS = [
  { id: 'breakfast', label: 'Breakfast', order: 0 },
  { id: 'dinner',    label: 'Dinner',    order: 1 },
];

// New plan format: { date: { slotId: meal } }
const mockPlan = {
  '2026-04-28': {
    breakfast: { name: 'Omelette',       nutrition: { kcal: 300, protein: 20, carbs: 10, fat: 18 } },
    dinner:    { name: 'Butter Chicken', nutrition: { kcal: 450, protein: 35, carbs: 40, fat: 12 } },
  },
  '2026-04-29': {
    breakfast: { name: 'Porridge',       nutrition: { kcal: 250, protein: 10, carbs: 45, fat: 5 } },
    dinner:    { name: 'Pasta Bolognese',nutrition: { kcal: 520, protein: 28, carbs: 60, fat: 15 } },
  },
};

const defaultProps = {
  macroProfile,
  startDate: '2026-04-28',
  endDate: '2026-04-29',
  selectedCategories: [],
  selectedRestrictions: [],
  slots: SLOTS,
  onApply: jest.fn(),
  onClose: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe('PlannerModal', () => {
  it('renders macro targets', () => {
    render(<PlannerModal {...defaultProps} />);
    expect(screen.getByText(/2000 kcal/)).toBeInTheDocument();
    expect(screen.getByText(/150g protein/)).toBeInTheDocument();
    expect(screen.getByText(/200g carbs/)).toBeInTheDocument();
    expect(screen.getByText(/60g fat/)).toBeInTheDocument();
  });

  it('shows generate button in idle state', () => {
    render(<PlannerModal {...defaultProps} />);
    expect(screen.getByText('Generate plan')).toBeInTheDocument();
  });

  it('shows all slot names in the description', () => {
    render(<PlannerModal {...defaultProps} />);
    expect(screen.getByText(/breakfast/i)).toBeInTheDocument();
    expect(screen.getByText(/dinner/i)).toBeInTheDocument();
  });

  it('shows spinner while generating', async () => {
    generateMealPlan.mockImplementation(
      ({ onProgress }) =>
        new Promise((resolve) => {
          onProgress('Fetching recipe candidates…');
          setTimeout(resolve, 5000);
        })
    );
    render(<PlannerModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Generate plan'));
    await screen.findByText('Fetching recipe candidates…');
    expect(screen.getByTestId('planner-spinner')).toBeInTheDocument();
  });

  it('shows results and apply button after success', async () => {
    generateMealPlan.mockResolvedValue(mockPlan);
    render(<PlannerModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Generate plan'));
    await screen.findByText('Butter Chicken');
    expect(screen.getByText('Pasta Bolognese')).toBeInTheDocument();
    expect(screen.getByText('Apply to plan')).toBeInTheDocument();
  });

  it('calls onApply with the plan and onClose when apply is clicked', async () => {
    generateMealPlan.mockResolvedValue(mockPlan);
    render(<PlannerModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Generate plan'));
    await screen.findByText('Apply to plan');
    fireEvent.click(screen.getByText('Apply to plan'));
    expect(defaultProps.onApply).toHaveBeenCalledWith(mockPlan);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows error message on failure with retry button', async () => {
    generateMealPlan.mockRejectedValue(new Error('Not enough recipes available.'));
    render(<PlannerModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Generate plan'));
    await screen.findByText('Not enough recipes available.');
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(<PlannerModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('planner-overlay'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when × button is clicked', () => {
    render(<PlannerModal {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('allows regeneration after success', async () => {
    generateMealPlan.mockResolvedValue(mockPlan);
    render(<PlannerModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Generate plan'));
    await screen.findByText('Regenerate');
    fireEvent.click(screen.getByText('Regenerate'));
    expect(generateMealPlan).toHaveBeenCalledTimes(2);
  });
});
