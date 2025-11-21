import { Shape } from '../../src/entities/Shape';

// Test implementation for abstract Shape class
class TestShape extends Shape {
  constructor(id: string) {
    super(id);
  }

  public toString(): string {
    return `TestShape(id: ${this.id})`;
  }
}

// Tests for Shape entity - creation and basic properties
describe('Shape', () => {
  test('should create shape and check inheritance', () => {
    // Test creating shape and checking inheritance from Shape
    const shape = new TestShape('shape1');
    expect(shape.id).toBe('shape1');
    expect(shape.toString()).toBe('TestShape(id: shape1)');
    expect(shape.getId()).toBe('shape1');
  });
});
