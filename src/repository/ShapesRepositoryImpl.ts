import { IShapesRepository } from './ShapeRepository';
import { Shape } from '../entities/Shape';
import { Specification } from './specifications/Specification';

export class ShapesRepository implements IShapesRepository {
  private shapes: Map<string, Shape> = new Map(); // Хранилище фигур

  public add(shape: Shape): void {
    if (this.shapes.has(shape.id)) {
      throw new Error(`Shape with id ${shape.id} already exists`);
    }
    this.shapes.set(shape.id, shape); // Добавление фигуры
  }

  public remove(id: string): boolean {
    return this.shapes.delete(id); // Удаление по ID
  }

  public findById(id: string): Shape | undefined {
    return this.shapes.get(id); // Поиск по ID
  }

  public findAll(): Shape[] {
    return Array.from(this.shapes.values());  // Все фигуры
  }

  // Specification Pattern: поиск по критерию
  public findBySpecification(spec: Specification): Shape[] {
    return this.findAll().filter(shape => spec.isSatisfiedBy(shape));
  }

  public getCount(): number {
    return this.shapes.size; // Количество фигур
  }

  public clear(): void {
    this.shapes.clear();// Очистка хранилища
  }

  // Дополнительные методы для удобства
  public getCubes(): Shape[] {
    return this.findAll().filter(shape => shape.constructor.name === 'Cube');
  }

  public getRectangles(): Shape[] {
    return this.findAll().filter(shape => shape.constructor.name === 'Rectangle');
  }
}