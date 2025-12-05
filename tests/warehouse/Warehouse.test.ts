import { Warehouse } from '../../src/warehouse/Warehouse.js';
import { Cube } from '../../src/entities/Cube.js';
import { Rectangle } from '../../src/entities/Rectangle.js';
import { Point } from '../../src/entities/Point.js';
import { CalculationError } from '../../src/exceptions/CustomExceptions.js';

describe('Warehouse', () => {
  let warehouse: Warehouse;

  beforeEach(() => {
    warehouse = Warehouse.getInstance();
    warehouse.clearCache();
  });

  test('should be singleton', () => {
    const instance1 = Warehouse.getInstance();
    const instance2 = Warehouse.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('should calculate and cache cube surface area', () => {
    const cube = new Cube('test-cube', new Point(0, 0, 0), 3);
    expect(warehouse.getSurfaceArea(cube)).toBe(54);
  });

  test('should calculate and cache cube volume', () => {
    const cube = new Cube('test-cube', new Point(0, 0, 0), 2);
    expect(warehouse.getVolume(cube)).toBe(8);
  });

  test('should calculate and cache rectangle area', () => {
    const rectangle = new Rectangle('test-rect', 
      new Point(0, 0), new Point(4, 0), 
      new Point(4, 3), new Point(0, 3)
    );
    expect(warehouse.getArea(rectangle)).toBe(12);
  });

  test('should calculate and cache rectangle perimeter', () => {
    const rectangle = new Rectangle('test-rect', 
      new Point(0, 0), new Point(4, 0), 
      new Point(4, 3), new Point(0, 3)
    );
    expect(warehouse.getPerimeter(rectangle)).toBe(14);
  });

  test('should update cache when notified', () => {
    const cube = new Cube('test-cube', new Point(0, 0, 0), 2);
    warehouse.getVolume(cube);
    warehouse.update('test-cube'); // Симуляция изменения
    // После update кэш очищен, следующий вызов пересчитает
    expect(warehouse.getVolume(cube)).toBe(8);
  });

  test('should throw error for unsupported operations', () => {
    const invalidShape = { id: 'invalid' } as any;
    expect(() => warehouse.getArea(invalidShape)).toThrow(CalculationError);
    expect(() => warehouse.getVolume(invalidShape)).toThrow(CalculationError);
  });

  test('should get cache statistics', () => {
    const cube = new Cube('test-cube', new Point(0, 0, 0), 2);
    warehouse.getVolume(cube);
    
    const stats = warehouse.getCacheStats();
    expect(stats.totalShapes).toBe(1);
    expect(typeof stats.cacheHits).toBe('number');
  });

  test('should clear cache', () => {
    const cube = new Cube('test-cube', new Point(0, 0, 0), 2);
    warehouse.getVolume(cube);
    
    expect(warehouse.getCacheStats().totalShapes).toBe(1);
    warehouse.clearCache();
    expect(warehouse.getCacheStats().totalShapes).toBe(0);
  });
});
