import { 
  FindByIdSpecification,
  FindByQuadrantSpecification,
  FindByDistanceFromOriginSpecification 
} from '../../../src/repository/specifications/BasicSpecifications.js';
import { Cube } from '../../../src/entities/Cube.js';
import { Point } from '../../../src/entities/Point.js';

describe('Specifications Simple', () => {
  test('FindByIdSpecification should match correct id', () => {
    const spec = new FindByIdSpecification('cube1');
    const cube = new Cube('cube1', new Point(0, 0, 0), 2);
    const otherCube = new Cube('cube2', new Point(0, 0, 0), 2);
    
    expect(spec.isSatisfiedBy(cube)).toBe(true);
    expect(spec.isSatisfiedBy(otherCube)).toBe(false);
  });

  test('FindByQuadrantSpecification should detect quadrants', () => {
    const spec1 = new FindByQuadrantSpecification(1);
    const spec2 = new FindByQuadrantSpecification(2);
    const spec3 = new FindByQuadrantSpecification(3);
    const spec4 = new FindByQuadrantSpecification(4);
    
    const cube1 = new Cube('cube1', new Point(1, 1, 0), 2); // 1 квадрант
    const cube2 = new Cube('cube2', new Point(-1, 1, 0), 2); // 2 квадрант
    const cube3 = new Cube('cube3', new Point(-1, -1, 0), 2); // 3 квадрант
    const cube4 = new Cube('cube4', new Point(1, -1, 0), 2); // 4 квадрант
    
    expect(spec1.isSatisfiedBy(cube1)).toBe(true);
    expect(spec2.isSatisfiedBy(cube2)).toBe(true);
    expect(spec3.isSatisfiedBy(cube3)).toBe(true);
    expect(spec4.isSatisfiedBy(cube4)).toBe(true);
    
    expect(spec1.isSatisfiedBy(cube2)).toBe(false);
    expect(() => new FindByQuadrantSpecification(5)).toThrow();
  });

  test('FindByDistanceFromOriginSpecification should filter by distance', () => {
    const spec = new FindByDistanceFromOriginSpecification(0, 5);
    const cubeClose = new Cube('cube1', new Point(1, 2, 0), 2); // √(1²+2²) ≈ 2.24
    const cubeFar = new Cube('cube2', new Point(10, 10, 0), 2); // √(10²+10²) ≈ 14.14
    
    expect(spec.isSatisfiedBy(cubeClose)).toBe(true);
    expect(spec.isSatisfiedBy(cubeFar)).toBe(false);
  });

  test('should throw error for invalid ranges', () => {
    expect(() => new FindByDistanceFromOriginSpecification(-1, 10)).toThrow();
    expect(() => new FindByDistanceFromOriginSpecification(10, 5)).toThrow();
  });
});