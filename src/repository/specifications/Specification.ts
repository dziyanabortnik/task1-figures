import { Shape } from '../../entities/Shape';

export interface Specification {
  isSatisfiedBy(shape: Shape): boolean; // Проверка удовлетворения критерию
}
