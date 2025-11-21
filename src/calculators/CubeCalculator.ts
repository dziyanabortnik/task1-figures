import { Cube } from '../entities/Cube.js';
import { CalculationError } from '../exceptions/CustomExceptions.js';

//Calculator for cube geometry operations

export class CubeCalculator {
  // Calculate surface area of cube
  public calculateSurfaceArea(cube: Cube): number {
    if (cube.sideLength <= 0) {
      throw new CalculationError('Cube side length must be positive');
    }
    return 6 * Math.pow(cube.sideLength, 2);
  }

  // Calculate volume of cube
  public calculateVolume(cube: Cube): number {
    if (cube.sideLength <= 0) {
      throw new CalculationError('Cube side length must be positive');
    }
    return Math.pow(cube.sideLength, 3);
  }

  // Calculate volume ratio when cut by coordinate plane
  public calculateVolumeRatioByPlane(
    cube: Cube,
    plane: 'xy' | 'xz' | 'yz',
  ): number {
    if (cube.sideLength <= 0) {
      throw new CalculationError('Cube side length must be positive');
    }

    const { basePoint, sideLength } = cube;
    let distanceFromPlane = 0;

    switch (plane) {
    case 'xy':
      distanceFromPlane = Math.abs(basePoint.z);
      break;
    case 'xz':
      distanceFromPlane = Math.abs(basePoint.y);
      break;
    case 'yz':
      distanceFromPlane = Math.abs(basePoint.x);
      break;
    default:
      throw new CalculationError(`Invalid plane: ${plane}`);
    }

    if (distanceFromPlane <= 0) return 0;
    if (distanceFromPlane >= sideLength) return 1;

    const smallerVolume = Math.pow(distanceFromPlane, 3);
    const largerVolume = Math.pow(sideLength - distanceFromPlane, 3);
    return (
      Math.min(smallerVolume, largerVolume) /
      Math.max(smallerVolume, largerVolume)
    );
  }

  // Calculate space diagonal
  public calculateSpaceDiagonal(cube: Cube): number {
    if (cube.sideLength <= 0) {
      throw new CalculationError('Cube side length must be positive');
    }
    return cube.sideLength * Math.sqrt(3);
  }

  // Calculate face diagonal
  public calculateFaceDiagonal(cube: Cube): number {
    if (cube.sideLength <= 0) {
      throw new CalculationError('Cube side length must be positive');
    }
    return cube.sideLength * Math.sqrt(2);
  }
}
