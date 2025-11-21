// Abstract base class for all geometric shapes
export abstract class Shape {
  constructor(public readonly id: string) {} // Unique identifier for the shape

  public abstract toString(): string;
  
  public getId(): string {
    return this.id;
  }
}
