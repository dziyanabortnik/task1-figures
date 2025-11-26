import { ShapeFactory } from './ShapeFactory.js';
import { Cube } from '../entities/Cube.js';
import { Point } from '../entities/Point.js';
import { InvalidDataFormatError, ShapeValidationError } from '../exceptions/CustomExceptions.js';

export class CubeFactory implements ShapeFactory<Cube> {
  private static readonly DATA_REGEX = /^([a-zA-Z0-9_]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)$/;
  
  public validateData(data: string): boolean {
    const trimmedData = data.trim();
    
    if (trimmedData.length === 0 || trimmedData.startsWith('#')) {
      return false;
    }
    
    return CubeFactory.DATA_REGEX.test(trimmedData);
  }

  public createFromString(data: string): Cube {
    const trimmedData = data.trim();
    
    if (!this.validateData(trimmedData)) {
      throw new InvalidDataFormatError(`Invalid cube data format: ${data}`);
    }

    const match = trimmedData.match(CubeFactory.DATA_REGEX);
    if (!match) {
      throw new InvalidDataFormatError(`Failed to parse cube data: ${data}`);
    }

    const [, id, x, y, z, sideLength] = match;
    
    const basePointX = parseFloat(x);
    const basePointY = parseFloat(y);
    const basePointZ = parseFloat(z);
    const sideLengthValue = parseFloat(sideLength);

    // Валидация числовых значений
    if (!this.isValidNumber(basePointX) || !this.isValidNumber(basePointY) || 
        !this.isValidNumber(basePointZ) || !this.isValidNumber(sideLengthValue)) {
      throw new InvalidDataFormatError(`Invalid numeric values in cube data: ${data}`);
    }

    if (sideLengthValue <= 0) {
      throw new ShapeValidationError(`Side length must be positive: ${sideLengthValue}`);
    }

    const basePoint = new Point(basePointX, basePointY, basePointZ);
    return new Cube(id, basePoint, sideLengthValue);
  }

  private isValidNumber(value: number): boolean {
    return !isNaN(value) && isFinite(value);
  }
}
