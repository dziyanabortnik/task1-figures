import { ShapesRepository } from '../../src/repository/ShapesRepositoryImpl.js';
import { Cube } from '../../src/entities/Cube.js';
import { Rectangle } from '../../src/entities/Rectangle.js';
import { Point } from '../../src/entities/Point.js';
import { FindByIdSpecification } from '../../src/repository/specifications/BasicSpecifications.js';

describe('ShapesRepository', () => {
  let repository: ShapesRepository;

  beforeEach(() => {
    repository = new ShapesRepository();
  });

  test('should add and find shapes', () => {
    const cube = new Cube('cube1', new Point(0, 0, 0), 2);
    const rect = new Rectangle('rect1', 
      new Point(0, 0), new Point(4, 0), 
      new Point(4, 3), new Point(0, 3)
    );

    repository.add(cube);
    repository.add(rect);

    expect(repository.getCount()).toBe(2);
    expect(repository.findById('cube1')).toBe(cube);
    expect(repository.findById('rect1')).toBe(rect);
    expect(repository.findById('nonexistent')).toBeUndefined();
  });

  test('should throw error when adding duplicate id', () => {
    const cube1 = new Cube('cube1', new Point(0, 0, 0), 2);
    const cube2 = new Cube('cube1', new Point(1, 1, 1), 3);
    
    repository.add(cube1);
    expect(() => repository.add(cube2)).toThrow();
  });

  test('should remove shapes', () => {
    const cube = new Cube('cube1', new Point(0, 0, 0), 2);
    repository.add(cube);
    
    expect(repository.remove('cube1')).toBe(true);
    expect(repository.getCount()).toBe(0);
    expect(repository.remove('nonexistent')).toBe(false);
  });

  test('should find by specification', () => {
    const cube1 = new Cube('cube1', new Point(1, 1, 0), 2);
    const cube2 = new Cube('cube2', new Point(-1, -1, 0), 2);
    repository.add(cube1);
    repository.add(cube2);

    const spec = new FindByIdSpecification('cube1');
    const result = repository.findBySpecification(spec);
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('cube1');
  });

  test('should get cubes and rectangles separately', () => {
    const cube = new Cube('cube1', new Point(0, 0, 0), 2);
    const rect = new Rectangle('rect1', 
      new Point(0, 0), new Point(4, 0), 
      new Point(4, 3), new Point(0, 3)
    );
    
    repository.add(cube);
    repository.add(rect);

    expect(repository.getCubes()).toHaveLength(1);
    expect(repository.getRectangles()).toHaveLength(1);
  });

  test('should clear all shapes', () => {
    const cube = new Cube('cube1', new Point(0, 0, 0), 2);
    repository.add(cube);
    
    expect(repository.getCount()).toBe(1);
    repository.clear();
    expect(repository.getCount()).toBe(0);
  });

  test('should handle empty repository', () => {
    expect(repository.getCount()).toBe(0);
    expect(repository.findAll()).toHaveLength(0);
    expect(repository.getCubes()).toHaveLength(0);
    expect(repository.getRectangles()).toHaveLength(0);
  });
});
