import { Rectangle } from '../entities/Rectangle';
import { Point } from '../entities/Point';

// Calculator for rectangle geometry operations
export class RectangleCalculator {
  // Calculate area using two adjacent sides
  public calculateArea(rectangle: Rectangle): number {
    const { point1, point2, point3 } = rectangle;
    const side1 = this.calculateDistance(point1, point2);
    const side2 = this.calculateDistance(point2, point3);
    return side1 * side2;
  }

  // Calculate perimeter by summing all sides
  public calculatePerimeter(rectangle: Rectangle): number {
    const { point1, point2, point3, point4 } = rectangle;
    const side1 = this.calculateDistance(point1, point2);
    const side2 = this.calculateDistance(point2, point3);
    const side3 = this.calculateDistance(point3, point4);
    const side4 = this.calculateDistance(point4, point1);
    return side1 + side2 + side3 + side4;
  }

  // Calculate diagonal between opposite vertices
  public calculateDiagonal(rectangle: Rectangle): number {
    const { point1, point3 } = rectangle;
    return this.calculateDistance(point1, point3);
  }

  // Calculate distance between two points
  private calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
