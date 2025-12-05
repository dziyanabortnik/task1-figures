import { WarehouseObserver } from './WarehouseObserver';
import { Shape } from '../entities/Shape';
import { Cube } from '../entities/Cube';
import { Rectangle } from '../entities/Rectangle';
import { CubeCalculator } from '../calculators/CubeCalculator';
import { RectangleCalculator } from '../calculators/RectangleCalculator';
import { CalculationError } from '../exceptions/CustomExceptions';

//Singleton для кэширования вычисленных значений
type ShapeProperties = {
  area?: number;
  volume?: number;
  perimeter?: number;
  surfaceArea?: number;
  lastUpdated: number;
};

export class Warehouse implements WarehouseObserver {
  private static instance: Warehouse; // Единственный экземпляр (Singleton)
  private properties: Map<string, ShapeProperties> = new Map();// Кэш свойств
  private cubeCalculator = new CubeCalculator();
  private rectangleCalculator = new RectangleCalculator();

  private constructor() {}

  public static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }

  // Observer: вызывается при изменении фигуры
  public update(shapeId: string): void {
    console.log(`Warehouse: Shape ${shapeId} changed, clearing cached properties`);
    this.properties.delete(shapeId);
  }

  public getArea(shape: Shape): number {
    const cached = this.getCachedProperties(shape.id);
    if (cached?.area !== undefined) {
      return cached.area;
    }

    let area: number;
    if (shape instanceof Rectangle) {
      area = this.rectangleCalculator.calculateArea(shape);
    } else {
      throw new CalculationError(`Cannot calculate area for shape type: ${shape.constructor.name}`);
    }

    this.cacheProperty(shape.id, 'area', area);
    return area;
  }

  public getSurfaceArea(shape: Shape): number {
    const cached = this.getCachedProperties(shape.id);
    if (cached?.surfaceArea !== undefined) {
      return cached.surfaceArea;
    }

    let surfaceArea: number;
    if (shape instanceof Cube) {
      surfaceArea = this.cubeCalculator.calculateSurfaceArea(shape);
    } else {
      throw new CalculationError(`Cannot calculate surface area for shape type: ${shape.constructor.name}`);
    }

    this.cacheProperty(shape.id, 'surfaceArea', surfaceArea);
    return surfaceArea;
  }

  public getVolume(shape: Shape): number {
    const cached = this.getCachedProperties(shape.id);
    if (cached?.volume !== undefined) {
      return cached.volume;
    }

    let volume: number;
    if (shape instanceof Cube) {
      volume = this.cubeCalculator.calculateVolume(shape);
    } else {
      throw new CalculationError(`Cannot calculate volume for shape type: ${shape.constructor.name}`);
    }

    this.cacheProperty(shape.id, 'volume', volume);
    return volume;
  }

  public getPerimeter(shape: Shape): number {
    const cached = this.getCachedProperties(shape.id);
    if (cached?.perimeter !== undefined) {
      return cached.perimeter;
    }

    let perimeter: number;
    if (shape instanceof Rectangle) {
      perimeter = this.rectangleCalculator.calculatePerimeter(shape);
    } else {
      throw new CalculationError(`Cannot calculate perimeter for shape type: ${shape.constructor.name}`);
    }

    this.cacheProperty(shape.id, 'perimeter', perimeter);
    return perimeter;
  }

  public clearCache(): void {
    this.properties.clear();
  }

  public getCacheStats(): { totalShapes: number; cacheHits: number } {
    let cacheHits = 0;
    this.properties.forEach(props => {
      if (props.lastUpdated > Date.now() - 60000) { // Within last minute
        cacheHits++;
      }
    });
    return {
      totalShapes: this.properties.size,
      cacheHits
    };
  }

  private getCachedProperties(shapeId: string): ShapeProperties | undefined {
    return this.properties.get(shapeId);
  }

  private cacheProperty(shapeId: string, property: keyof ShapeProperties, value: number): void {
    const existing = this.properties.get(shapeId) || { lastUpdated: Date.now() };
    this.properties.set(shapeId, {
      ...existing,
      [property]: value,
      lastUpdated: Date.now()
    });
  }
}