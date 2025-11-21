//Point in 3D space
export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number = 0,  // Default 0 for 2D
    public readonly id?: string,
  ) {}

  public toString(): string {
    return `Point(${this.x}, ${this.y}, ${this.z})`;
  }

  // Compare two points for equality
  public equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}
