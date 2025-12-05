import { Shape } from './Shape';
import { Point } from './Point';

//Rectangle entity with 4 corner points
export class Rectangle extends Shape {
  constructor(
    public readonly id: string,
    public readonly point1: Point,
    public readonly point2: Point,
    public readonly point3: Point,
    public readonly point4: Point,
  ) {
    super(id);
  }

  public toString(): string {
    return `Rectangle(id: ${this.id})`;
  }
}
