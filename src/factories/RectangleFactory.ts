import { ShapeFactory } from './ShapeFactory';
import { Rectangle } from '../entities/Rectangle';
import { Point } from '../entities/Point';
import { InvalidDataFormatError } from '../exceptions/CustomExceptions';

export class RectangleFactory implements ShapeFactory<Rectangle> {
  private static readonly DATA_REGEX = /^([a-zA-Z0-9_]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)$/;
  
  public validateData(data: string): boolean {
    const trimmedData = data.trim();
    
    if (trimmedData.length === 0 || trimmedData.startsWith('#')) {
      return false;
    }
    
    return RectangleFactory.DATA_REGEX.test(trimmedData);
  }

  public createFromString(data: string): Rectangle {
    const trimmedData = data.trim();
    
    if (!this.validateData(trimmedData)) {
      throw new InvalidDataFormatError(`Invalid rectangle data format: ${data}`);
    }

    const match = trimmedData.match(RectangleFactory.DATA_REGEX);
    if (!match) {
      throw new InvalidDataFormatError(`Failed to parse rectangle data: ${data}`);
    }

    const [, id, 
           x1, y1, 
           x2, y2, 
           x3, y3, 
           x4, y4] = match;
    
    const coords = [
      parseFloat(x1), parseFloat(y1),
      parseFloat(x2), parseFloat(y2),
      parseFloat(x3), parseFloat(y3),
      parseFloat(x4), parseFloat(y4)
    ];

    if (coords.some(coord => !this.isValidNumber(coord))) {
      throw new InvalidDataFormatError(`Invalid numeric values in rectangle data: ${data}`);
    }

    const point1 = new Point(coords[0], coords[1]);
    const point2 = new Point(coords[2], coords[3]);
    const point3 = new Point(coords[4], coords[5]);
    const point4 = new Point(coords[6], coords[7]);
    
    return new Rectangle(id, point1, point2, point3, point4);
  }

  private isValidNumber(value: number): boolean {
    return !isNaN(value) && isFinite(value);
  }
}
