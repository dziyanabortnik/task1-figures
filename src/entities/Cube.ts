import { Shape } from './Shape.js';
import { Point } from './Point.js';

//Cube entity
export class Cube extends Shape {
  constructor(
    public readonly id: string,
    public readonly basePoint: Point,  // One corner of cube
    public readonly sideLength: number, // Side length
  ) {
    super(id);
  }

  public toString(): string {
    return `Cube(id: ${this.id})`;
  }
}
