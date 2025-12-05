import { Shape } from '../../entities/Shape';
import { Cube } from '../../entities/Cube';
import { Rectangle } from '../../entities/Rectangle';
import { Warehouse } from '../../warehouse/Warehouse';

export interface Comparator<T> {
  compare(a: T, b: T): number;
}

export class ByIdComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    return a.id.localeCompare(b.id); // Сравнение по ID
  }
}

export class ByNameComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    const aName = a.constructor.name;
    const bName = b.constructor.name;
    return aName.localeCompare(bName); // Сравнение по имени класса
  }
}

export class ByFirstPointXComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    const aX = this.getFirstPointX(a);
    const bX = this.getFirstPointX(b);
    return aX - bX; // Сравнение по X координате
  }

  private getFirstPointX(shape: Shape): number {
    if (shape instanceof Cube) {
      return shape.basePoint.x;
    } else if (shape instanceof Rectangle) {
      return shape.point1.x;
    }
    return 0;
  }
}

export class ByFirstPointYComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    const aY = this.getFirstPointY(a);
    const bY = this.getFirstPointY(b);
    return aY - bY; // Сравнение по Y координате
  }

  private getFirstPointY(shape: Shape): number {
    if (shape instanceof Cube) {
      return shape.basePoint.y;
    } else if (shape instanceof Rectangle) {
      return shape.point1.y;
    }
    return 0;
  }
}

export class ByAreaComparator implements Comparator<Shape> {
  private warehouse = Warehouse.getInstance();

  public compare(a: Shape, b: Shape): number {
    try {
      const areaA = this.warehouse.getArea(a);
      const areaB = this.warehouse.getArea(b);
      return areaA - areaB;
    } catch {
      // Если нельзя сравнить по площади, сортируем по id
      return a.id.localeCompare(b.id);
    }
  }
}
