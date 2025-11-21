import { Point } from '../../src/entities/Point';

// Tests for Point entity - creation, comparison and string representation
describe('Point', () => {
  test('should create points and check equality', () => {
    const point1 = new Point(1, 2, 3);
    const point2 = new Point(1, 2, 3);
    const point3 = new Point(4, 5, 6);
    
    expect(point1.equals(point2)).toBe(true); // Same coordinates
    expect(point1.equals(point3)).toBe(false); // Different coordinates
    expect(point1.toString()).toBe('Point(1, 2, 3)');
  });
});
