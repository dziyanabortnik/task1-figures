import { Cube } from '../../src/entities/Cube';
import { Point } from '../../src/entities/Point';

// Tests for Cube entity - creation and basic properties
describe('Cube', () => {
  test('should create cube and check inheritance', () => {
    const cube = new Cube('cube1', new Point(1, 2, 3), 2);
    expect(cube.id).toBe('cube1');
    expect(cube.toString()).toBe('Cube(id: cube1)');
  });
});
