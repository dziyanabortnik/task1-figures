import { ShapeFactory } from './ShapeFactory.js';
import { Cube } from '../entities/Cube.js';
import { Point } from '../entities/Point.js';
import { InvalidDataFormatError, ShapeValidationError } from '../exceptions/CustomExceptions.js';

export class CubeFactory implements ShapeFactory<Cube> {
  public validateData(data: string): boolean {
    try {
      const parsed = JSON.parse(data.trim());
      return typeof parsed.id === 'string' && 
             Array.isArray(parsed.basePoint) && 
             typeof parsed.sideLength === 'number' &&
             parsed.sideLength > 0;
    } catch {
      return false;
    }
  }

  public createFromString(data: string): Cube {
    const trimmedData = data.trim();
    
    if (!this.validateData(trimmedData)) {
      throw new InvalidDataFormatError(`Invalid cube data: ${data}`);
    }

    const parsed = JSON.parse(trimmedData);

    if (parsed.sideLength <= 0) {
      throw new ShapeValidationError(`Side length must be positive: ${parsed.sideLength}`);
    }

    const basePoint = new Point(parsed.basePoint[0], parsed.basePoint[1], parsed.basePoint[2]);
    return new Cube(parsed.id, basePoint, parsed.sideLength);
  }
}
