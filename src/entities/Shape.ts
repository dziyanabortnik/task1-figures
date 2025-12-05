import { ShapeSubject } from '../warehouse/ShapeSubject.js';

export abstract class Shape extends ShapeSubject {
  constructor(public readonly id: string) {
    super();
  }

  public abstract toString(): string;
  
  public getId(): string {
    return this.id;
  }

  protected notifyChange(): void {
    this.notifyObservers(); // Вызов уведомления наблюдателей
  }
}
