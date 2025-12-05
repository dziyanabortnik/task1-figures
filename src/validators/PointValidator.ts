import { Point } from '../entities/Point';

//Utility class for point validation
export class PointValidator {
  private static readonly COLLINEARITY_THRESHOLD = 1e-10;

  // Check if point coordinates are valid numbers
  public static isValidPoint(x: number, y: number, z: number = 0): boolean {
    return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z);
  }

  // Check if two points are equal
  public static arePointsEqual(p1: Point, p2: Point): boolean {
    return p1.x === p2.x && p1.y === p2.y && p1.z === p2.z;
  }

  // Check if three points are collinear
  public static arePointsCollinear(p1: Point, p2: Point, p3: Point): boolean {
    const area = Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2,
    );
    return area < PointValidator.COLLINEARITY_THRESHOLD;
  }
}
