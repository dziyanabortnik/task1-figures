//Интерфейс для Observer паттерна
export interface WarehouseObserver {
  update(shapeId: string): void; // Метод уведомления об изменении фигуры
}