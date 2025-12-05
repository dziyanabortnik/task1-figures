import { 
  ByIdComparator, 
  ByNameComparator,
  ByFirstPointXComparator,
  ByFirstPointYComparator 
} from '../../../src/repository/comparators/ShapeComparators.js';
import { Cube } from '../../../src/entities/Cube.js';
import { Rectangle } from '../../../src/entities/Rectangle.js';
import { Point } from '../../../src/entities/Point.js';

describe('Comparators Simple', () => {
  test('ByIdComparator should sort alphabetically', () => {
    const comparator = new ByIdComparator();
    const cubeA = new Cube('a', new Point(0, 0, 0), 2);
    const cubeB = new Cube('b', new Point(0, 0, 0), 2);
    
    expect(comparator.compare(cubeA, cubeB)).toBeLessThan(0);
    expect(comparator.compare(cubeB, cubeA)).toBeGreaterThan(0);
  });
  test('ByNameComparator should sort by class name', () => {
    const comparator = new ByNameComparator();
    const cube = new Cube('cube1', new Point(0, 0, 0), 2);
    const rectangle = new Rectangle('rect1', 
      new Point(0, 0), new Point(4, 0), 
      new Point(4, 3), new Point(0, 3)
    );
    
    expect(comparator.compare(cube, rectangle)).toBeLessThan(0);
    expect(comparator.compare(rectangle, cube)).toBeGreaterThan(0);
  });

  test('ByFirstPointXComparator should sort by X coordinate', () => {
    const comparator = new ByFirstPointXComparator();
    const cube1 = new Cube('cube1', new Point(1, 0, 0), 2);
    const cube2 = new Cube('cube2', new Point(3, 0, 0), 2);
    
    expect(comparator.compare(cube1, cube2)).toBeLessThan(0);
    expect(comparator.compare(cube2, cube1)).toBeGreaterThan(0);
  });

  test('ByFirstPointYComparator should sort by Y coordinate', () => {
    const comparator = new ByFirstPointYComparator();
    const cube1 = new Cube('cube1', new Point(0, 1, 0), 2);
    const cube2 = new Cube('cube2', new Point(0, 3, 0), 2);
    
    expect(comparator.compare(cube1, cube2)).toBeLessThan(0);
    expect(comparator.compare(cube2, cube1)).toBeGreaterThan(0);
  });
});
