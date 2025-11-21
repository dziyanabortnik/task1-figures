import { RectangleCalculator } from '../../src/calculators/RectangleCalculator';
import { Rectangle } from '../../src/entities/Rectangle';
import { Point } from '../../src/entities/Point';

// Tests for RectangleCalculator - area, perimeter and diagonal calculations
describe('RectangleCalculator', () => {
  const calculator = new RectangleCalculator();

  test('should calculate area, perimeter and diagonal', () => {
    const rectangle = new Rectangle('test', 
      new Point(0, 0), new Point(4, 0), 
      new Point(4, 3), new Point(0, 3)
    );
    
    expect(calculator.calculateArea(rectangle)).toBe(12); // 4 * 3 = 12
    expect(calculator.calculatePerimeter(rectangle)).toBe(14); // 2*(4 + 3) = 14
    expect(calculator.calculateDiagonal(rectangle)).toBe(5); // Pythagorean triple: 3-4-5
  });
});
