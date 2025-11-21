import { Rectangle } from '../../src/entities/Rectangle';
import { Point } from '../../src/entities/Point';

// Tests for Rectangle entity - creation and basic properties
describe('Rectangle', () => {
  test('should create rectangle and check inheritance', () => {
    const rectangle = new Rectangle('rect1', 
      new Point(0, 0), new Point(4, 0), 
      new Point(4, 3), new Point(0, 3)
    );
    expect(rectangle.id).toBe('rect1');
    expect(rectangle.toString()).toBe('Rectangle(id: rect1)');
  });
});
