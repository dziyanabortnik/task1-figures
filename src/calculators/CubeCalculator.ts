import { Cube } from "../entities/Cube";
import { CalculationError } from "../exceptions/CustomExceptions";

export class CubeCalculator {
  // Площадь поверхности куба
  public calculateSurfaceArea(cube: Cube): number {
    const side = cube.sideLength;
    if (side <= 0) {
      throw new CalculationError("Cube side length must be positive");
    }
    return 6 * Math.pow(cube.sideLength, 2);
  }

  // Объем куба
  public calculateVolume(cube: Cube): number {
    const side = cube.sideLength;
    if (side <= 0) {
      throw new CalculationError("Cube side length must be positive");
    }
    return Math.pow(side, 3);
  }

  // Соотношение объемов при разрезании плоскостью
  public calculateVolumeRatioByPlane(
    cube: Cube,
    plane: "xy" | "xz" | "yz"
  ): number {
    const sideLength = cube.sideLength;
    if (sideLength <= 0) {
      throw new CalculationError("Cube side length must be positive");
    }

    const { basePoint } = cube;
    let distanceFromPlane = 0;

    switch (plane) {
      case "xy":
        distanceFromPlane = Math.abs(basePoint.z);
        break;
      case "xz":
        distanceFromPlane = Math.abs(basePoint.y);
        break;
      case "yz":
        distanceFromPlane = Math.abs(basePoint.x);
        break;
      default:
        throw new CalculationError(`Invalid plane: ${plane}`);
    }

    if (distanceFromPlane <= 0) return 0;
    if (distanceFromPlane >= sideLength) return 1;

     // Вычисление соотношения объемов
    const smallerVolume = Math.pow(distanceFromPlane, 3);
    const largerVolume = Math.pow(sideLength - distanceFromPlane, 3);
    return (
      Math.min(smallerVolume, largerVolume) /
      Math.max(smallerVolume, largerVolume)
    );
  }

  // Пространственная диагональ
  public calculateSpaceDiagonal(cube: Cube): number {
    const side = cube.sideLength;
    if (side <= 0) {
      throw new CalculationError("Cube side length must be positive");
    }
    return side * Math.sqrt(3);
  }

  // Диагональ грани
  public calculateFaceDiagonal(cube: Cube): number {
    const side = cube.sideLength;
    if (side <= 0) {
      throw new CalculationError("Cube side length must be positive");
    }
    return side * Math.sqrt(2);
  }
}
