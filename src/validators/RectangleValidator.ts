import { Rectangle } from '../entities/Rectangle.js';
import { Point } from '../entities/Point.js';
import { PointValidator } from './PointValidator.js';

//Validator for rectangle properties and characteristics
export class RectangleValidator {
  private static readonly PARALLEL_THRESHOLD = 1e-10;
  private static readonly COLLINEARITY_THRESHOLD = 1e-10;

  // Check if quadrilateral is a valid rectangle
  public isValidRectangle(rectangle: Rectangle): boolean {
    const { point1, point2, point3, point4 } = rectangle;

    if (this.hasDuplicatePoints([point1, point2, point3, point4])) {
      return false;
    }

    if (!this.isConvexQuadrilateral(point1, point2, point3, point4)) {
      return false;
    }

    return this.hasParallelOppositeSides(point1, point2, point3, point4);
  }

  private hasDuplicatePoints(points: Point[]): boolean {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (PointValidator.arePointsEqual(points[i], points[j])) {
          return true;
        }
      }
    }
    return false;
  }

  // Check if quadrilateral is convex using cross products
  private isConvexQuadrilateral(
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point,
  ): boolean {
    const crossProduct1 = this.crossProduct(p1, p2, p3);
    const crossProduct2 = this.crossProduct(p2, p3, p4);
    const crossProduct3 = this.crossProduct(p3, p4, p1);
    const crossProduct4 = this.crossProduct(p4, p1, p2);

    const signs = [
      Math.sign(crossProduct1),
      Math.sign(crossProduct2),
      Math.sign(crossProduct3),
      Math.sign(crossProduct4),
    ];

    const positive = signs.filter((sign) => sign > 0).length;
    const negative = signs.filter((sign) => sign < 0).length;

    return positive === 4 || negative === 4;
  }

  // Calculate 2D cross product
  private crossProduct(p1: Point, p2: Point, p3: Point): number {
    return (p2.x - p1.x) * (p3.y - p2.y) - (p2.y - p1.y) * (p3.x - p2.x);
  }

  // Check if opposite sides are parallel
  private hasParallelOppositeSides(
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point,
  ): boolean {
    const vectorAB = { x: p2.x - p1.x, y: p2.y - p1.y };
    const vectorBC = { x: p3.x - p2.x, y: p3.y - p2.y };
    const vectorCD = { x: p4.x - p3.x, y: p4.y - p3.y };
    const vectorDA = { x: p1.x - p4.x, y: p1.y - p4.y };

    const areParallel = (
      v1: { x: number; y: number },
      v2: { x: number; y: number },
    ): boolean => {
      const cross = Math.abs(v1.x * v2.y - v1.y * v2.x);
      return cross < RectangleValidator.PARALLEL_THRESHOLD;
    };

    return areParallel(vectorAB, vectorCD) && areParallel(vectorBC, vectorDA);
  }

  // Check if rectangle is a square
  public isSquare(rectangle: Rectangle): boolean {
    const sides = this.getSides(rectangle);
    const allSidesEqual = sides.every(
      (side) =>
        Math.abs(side - sides[0]) < RectangleValidator.PARALLEL_THRESHOLD,
    );

    if (!allSidesEqual) return false;

    const diagonals = this.getDiagonals(rectangle);
    return (
      Math.abs(diagonals[0] - diagonals[1]) <
      RectangleValidator.PARALLEL_THRESHOLD
    );
  }

  // Check if rectangle is a rhombus
  public isRhombus(rectangle: Rectangle): boolean {
    const sides = this.getSides(rectangle);
    return sides.every(
      (side) =>
        Math.abs(side - sides[0]) < RectangleValidator.PARALLEL_THRESHOLD,
    );
  }

  // Check if rectangle is a trapezoid
  public isTrapezoid(rectangle: Rectangle): boolean {
    const { point1, point2, point3, point4 } = rectangle;
    const vectorAB = { x: point2.x - point1.x, y: point2.y - point1.y };
    const vectorBC = { x: point3.x - point2.x, y: point3.y - point2.y };
    const vectorCD = { x: point4.x - point3.x, y: point4.y - point3.y };
    const vectorDA = { x: point1.x - point4.x, y: point1.y - point4.y };

    const areParallel = (
      v1: { x: number; y: number },
      v2: { x: number; y: number },
    ): boolean => {
      const cross = Math.abs(v1.x * v2.y - v1.y * v2.x);
      return cross < RectangleValidator.PARALLEL_THRESHOLD;
    };

    return areParallel(vectorAB, vectorCD) || areParallel(vectorBC, vectorDA);
  }

  // Check if rectangle intersects axis at given distance
  public intersectsAxisAtDistance(
    rectangle: Rectangle,
    axis: 'x' | 'y',
    distance: number,
  ): boolean {
    const { point1, point2, point3, point4 } = rectangle;
    const points = [point1, point2, point3, point4];

    if (axis === 'x') {
      const minY = Math.min(...points.map((p) => p.y));
      const maxY = Math.max(...points.map((p) => p.y));
      return minY <= distance && maxY >= distance;
    }

    if (axis === 'y') {
      const minX = Math.min(...points.map((p) => p.x));
      const maxX = Math.max(...points.map((p) => p.x));
      return minX <= distance && maxX >= distance;
    }

    return false;
  }

  // Check if rectangle is axis-aligned
  public isAxisAligned(rectangle: Rectangle): boolean {
    const { point1, point2, point3, point4 } = rectangle;
    const edges = [
      { dx: point2.x - point1.x, dy: point2.y - point1.y },
      { dx: point3.x - point2.x, dy: point3.y - point2.y },
      { dx: point4.x - point3.x, dy: point4.y - point3.y },
      { dx: point1.x - point4.x, dy: point1.y - point4.y },
    ];

    return edges.every(
      (edge) =>
        Math.abs(edge.dx) < RectangleValidator.PARALLEL_THRESHOLD ||
        Math.abs(edge.dy) < RectangleValidator.PARALLEL_THRESHOLD,
    );
  }

  private getSides(rectangle: Rectangle): number[] {
    const { point1, point2, point3, point4 } = rectangle;
    return [
      this.calculateDistance(point1, point2),
      this.calculateDistance(point2, point3),
      this.calculateDistance(point3, point4),
      this.calculateDistance(point4, point1),
    ];
  }

  private getDiagonals(rectangle: Rectangle): number[] {
    const { point1, point2, point3, point4 } = rectangle;
    return [
      this.calculateDistance(point1, point3),
      this.calculateDistance(point2, point4),
    ];
  }

  private calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
