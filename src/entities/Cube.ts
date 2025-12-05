import { Shape } from "./Shape.js";
import { Point } from "./Point.js";

export class Cube extends Shape {
  private _sideLength: number; // Приватное поле для sideLength

  constructor(
    public readonly id: string,
    public basePoint: Point,
    sideLength: number
  ) {
    super(id);
    this._sideLength = sideLength;
  }

  public get sideLength(): number {
    return this._sideLength;
  }

  public set sideLength(value: number) {
    if (value <= 0) {
      throw new Error('Side length must be positive');
    }
    if (this._sideLength !== value) {
      this._sideLength = value;
      this.notifyChange();// Observer: уведомление об изменении
    }
  }

  public setBasePoint(point: Point): void {
    if (!this.basePoint.equals(point)) {
      this.basePoint = point;
      this.notifyChange(); // Observer: уведомление об изменении
    }
  }

  public toString(): string {
    return `Cube(id: ${this.id})`;
  }
}
