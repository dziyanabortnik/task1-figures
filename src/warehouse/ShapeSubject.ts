import { WarehouseObserver } from './WarehouseObserver';

export abstract class ShapeSubject {
  private observers: WarehouseObserver[] = []; // Список наблюдателей

  public attach(observer: WarehouseObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer); // Добавление наблюдателя
    }
  }

  public detach(observer: WarehouseObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);  // Удаление наблюдателя
    }
  }

  protected notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.getId()); // Уведомление всех наблюдателей
    }
  }

  protected abstract getId(): string;
}