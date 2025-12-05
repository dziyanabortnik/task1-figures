import { Comparator } from './comparators/ShapeComparators';
import { Shape } from '../entities/Shape';

//Утилиты сортировки с использованием Comparator
export class SortUtils {
  // Сортировка фигур с одним компаратором
  public static sortShapes(shapes: Shape[], comparator: Comparator<Shape>): Shape[] {
    return [...shapes].sort((a, b) => comparator.compare(a, b));
  }

  // Сортировка с несколькими компараторами (приоритет по порядку)
  public static sortShapesWithMultipleComparators(
    shapes: Shape[],
    comparators: Comparator<Shape>[]
  ): Shape[] {
    return [...shapes].sort((a, b) => {
      for (const comparator of comparators) {
        const result = comparator.compare(a, b);
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    });
  }
}
