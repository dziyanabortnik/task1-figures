import { ShapeFactory } from './ShapeFactory.js';
import { Rectangle } from '../entities/Rectangle.js';
import { Point } from '../entities/Point.js';
import { InvalidDataFormatError } from '../exceptions/CustomExceptions.js';

export class RectangleFactory implements ShapeFactory<Rectangle> {
  public validateData(data: string): boolean {
    try {
      const parsed = JSON.parse(data.trim());
      return typeof parsed.id === 'string' && 
             Array.isArray(parsed.points) && 
             parsed.points.length === 4;
    } catch {
      return false;
    }
  }

  public createFromString(data: string): Rectangle {
    const trimmedData = data.trim();
    
    if (!this.validateData(trimmedData)) {
      throw new InvalidDataFormatError(`Invalid rectangle data: ${data}`);
    }

    const parsed = JSON.parse(trimmedData);
    
    const points = parsed.points.map((coord: number[]) => new Point(coord[0], coord[1]));
    
    return new Rectangle(parsed.id, points[0], points[1], points[2], points[3]);
  }
}
