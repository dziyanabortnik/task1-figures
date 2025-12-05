import { SortUtils } from '../../src/repository/SortUtils.js';
import { 
  ByIdComparator,
  ByFirstPointXComparator 
} from '../../src/repository/comparators/ShapeComparators.js';
import { Cube } from '../../src/entities/Cube.js';
import { Point } from '../../src/entities/Point.js';

describe('SortUtils', () => {
  test('should sort shapes with single comparator', () => {
    const comparator = new ByIdComparator();
    const shapes = [
      new Cube('b', new Point(0, 0, 0), 2),
      new Cube('a', new Point(0, 0, 0), 2),
      new Cube('c', new Point(0, 0, 0), 2),
    ];
    
    const sorted = SortUtils.sortShapes(shapes, comparator);
    expect(sorted[0].id).toBe('a');
    expect(sorted[1].id).toBe('b');
    expect(sorted[2].id).toBe('c');
  });

  test('should sort shapes with multiple comparators', () => {
    const byIdComparator = new ByIdComparator();
    const byXComparator = new ByFirstPointXComparator();
    
    const shapes = [
      new Cube('a', new Point(3, 0, 0), 2),
      new Cube('b', new Point(1, 0, 0), 2),
      new Cube('c', new Point(1, 0, 0), 2),
    ];
    
    const sorted = SortUtils.sortShapesWithMultipleComparators(shapes, [
      byXComparator, // Сначала по X
      byIdComparator, // Потом по ID если X равны
    ]);
    
    expect(sorted[0].id).toBe('b'); // X=1, id='b'
    expect(sorted[1].id).toBe('c'); // X=1, id='c' 
    expect(sorted[2].id).toBe('a'); // X=3
  });

  test('should return empty array for empty input', () => {
    const comparator = new ByIdComparator();
    const sorted = SortUtils.sortShapes([], comparator);
    expect(sorted).toEqual([]);
  });
});