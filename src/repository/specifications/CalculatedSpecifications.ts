import { Specification } from './Specification';
import { Shape } from '../../entities/Shape';
import { Cube } from '../../entities/Cube';
import { Rectangle } from '../../entities/Rectangle';
import { CubeCalculator } from '../../calculators/CubeCalculator';
import { RectangleCalculator } from '../../calculators/RectangleCalculator';

//Спецификации для вычисляемых свойств
export class FindByAreaRangeSpecification implements Specification {
  private rectangleCalculator = new RectangleCalculator();

  constructor(
    private readonly minArea: number,
    private readonly maxArea: number
  ) {
    this.validateRange(minArea, maxArea);
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Rectangle) {
      const area = this.rectangleCalculator.calculateArea(shape);
      return area >= this.minArea && area <= this.maxArea;
    }
    return false;
  }

  private validateRange(min: number, max: number): void {
    if (min < 0 || max < 0 || min > max) {
      throw new Error('Invalid area range');
    }
  }
}

export class FindByVolumeRangeSpecification implements Specification {
  private cubeCalculator = new CubeCalculator();

  constructor(
    private readonly minVolume: number,
    private readonly maxVolume: number
  ) {
    this.validateRange(minVolume, maxVolume);
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Cube) {
      const volume = this.cubeCalculator.calculateVolume(shape);
      return volume >= this.minVolume && volume <= this.maxVolume;
    }
    return false;
  }

  private validateRange(min: number, max: number): void {
    if (min < 0 || max < 0 || min > max) {
      throw new Error('Invalid volume range');
    }
  }
}

export class FindByPerimeterRangeSpecification implements Specification {
  private rectangleCalculator = new RectangleCalculator();

  constructor(
    private readonly minPerimeter: number,
    private readonly maxPerimeter: number
  ) {
    this.validateRange(minPerimeter, maxPerimeter);
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Rectangle) {
      const perimeter = this.rectangleCalculator.calculatePerimeter(shape);
      return perimeter >= this.minPerimeter && perimeter <= this.maxPerimeter;
    }
    return false;
  }

  private validateRange(min: number, max: number): void {
    if (min < 0 || max < 0 || min > max) {
      throw new Error('Invalid perimeter range');
    }
  }
}
