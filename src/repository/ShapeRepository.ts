import { Shape } from '../entities/Shape';
import { Specification } from './specifications/Specification';

export interface IShapesRepository {
  add(shape: Shape): void;
  remove(id: string): boolean;
  findById(id: string): Shape | undefined;
  findAll(): Shape[];
  findBySpecification(spec: Specification): Shape[];
  getCount(): number;
  clear(): void;
}
