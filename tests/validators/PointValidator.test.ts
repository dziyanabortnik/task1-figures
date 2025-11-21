import { PointValidator } from '../../src/validators/PointValidator';
import { Point } from '../../src/entities/Point';

// Tests for PointValidator - point utilities
describe('PointValidator', () => {
  test('should validate point coordinates', () => {
    expect(PointValidator.isValidPoint(1, 2, 3)).toBe(true); // Valid coordinates
    expect(PointValidator.isValidPoint(NaN, 2, 3)).toBe(false); // Invalid coordinates
  });

  test('should check point equality', () => {
    const p1 = new Point(1, 2, 3);
    const p2 = new Point(1, 2, 3);
    const p3 = new Point(4, 5, 6);
    
    expect(PointValidator.arePointsEqual(p1, p2)).toBe(true); // Same coordinates
    expect(PointValidator.arePointsEqual(p1, p3)).toBe(false); // Different coordinates
  });

  test('should detect collinear points', () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const p3 = new Point(2, 0); // All on X axis - collinear
    const p4 = new Point(1, 1); // Not on line - not collinear
    
    expect(PointValidator.arePointsCollinear(p1, p2, p3)).toBe(true);
    expect(PointValidator.arePointsCollinear(p1, p2, p4)).toBe(false);
  });
});
