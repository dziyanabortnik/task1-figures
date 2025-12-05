import { Specification } from './Specification';
import { Shape } from '../../entities/Shape';
import { Cube } from '../../entities/Cube';
import { Rectangle } from '../../entities/Rectangle';

//Базовые спецификации поиска
export class FindByIdSpecification implements Specification {
  constructor(private readonly id: string) {}

  public isSatisfiedBy(shape: Shape): boolean {
    return shape.id === this.id; // Проверка ID
  }
}

export class FindByQuadrantSpecification implements Specification {
  constructor(private readonly quadrant: number) {
    if (quadrant < 1 || quadrant > 4) {
      throw new Error('Quadrant must be between 1 and 4');
    }
  }

  public isSatisfiedBy(shape: Shape): boolean {
    let x: number, y: number;
    
    if (shape instanceof Cube) {
      x = shape.basePoint.x;
      y = shape.basePoint.y;
    } else if (shape instanceof Rectangle) {
      x = shape.point1.x;
      y = shape.point1.y;
    } else {
      return false;
    }

    return this.isPointInQuadrant(x, y);
  }

  private isPointInQuadrant(x: number, y: number): boolean {
    switch (this.quadrant) {
      case 1: return x >= 0 && y >= 0;
      case 2: return x < 0 && y >= 0;
      case 3: return x < 0 && y < 0;
      case 4: return x >= 0 && y < 0;
      default: return false;
    }
  }
}

export class FindByDistanceFromOriginSpecification implements Specification {
  constructor(
    private readonly minDistance: number,
    private readonly maxDistance: number
  ) {
    if (minDistance < 0 || maxDistance < 0 || minDistance > maxDistance) {
      throw new Error('Invalid distance range');
    }
  }

  public isSatisfiedBy(shape: Shape): boolean {
    const distance = this.calculateDistanceFromOrigin(shape);
    return distance >= this.minDistance && distance <= this.maxDistance;
  }

  private calculateDistanceFromOrigin(shape: Shape): number {
    if (shape instanceof Cube) {
      return Math.sqrt(
        shape.basePoint.x ** 2 + 
        shape.basePoint.y ** 2 + 
        shape.basePoint.z ** 2
      );
    } else if (shape instanceof Rectangle) {
      return Math.sqrt(shape.point1.x ** 2 + shape.point1.y ** 2);
    }
    return 0;
  }
}
