import { Shape } from '../entities/Shape.js';

// Factory interface for creating shape objects
export interface ShapeFactory<T extends Shape> {
  createFromString(data: string): T;
  validateData(data: string): boolean;
}
