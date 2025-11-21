import { Cube } from '../entities/Cube.js';

//Validator for cube properties and positioning
export class CubeValidator {
  private static readonly PLANE_THRESHOLD = 1e-10;

  // Check if cube is valid
  public isValidCube(cube: Cube): boolean {
    return cube.sideLength > 0 && Number.isFinite(cube.sideLength);
  }

  // Check if cube touches any coordinate plane
  public isBaseOnCoordinatePlane(cube: Cube): boolean {
    const { basePoint } = cube;
    return (
      Math.abs(basePoint.x) < CubeValidator.PLANE_THRESHOLD ||
      Math.abs(basePoint.y) < CubeValidator.PLANE_THRESHOLD ||
      Math.abs(basePoint.z) < CubeValidator.PLANE_THRESHOLD
    );
  }

  // Check if cube touches specific coordinate plane
  public isBaseOnSpecificPlane(cube: Cube, plane: 'xy' | 'xz' | 'yz'): boolean {
    const { basePoint } = cube;
    switch (plane) {
    case 'xy':
      return Math.abs(basePoint.z) < CubeValidator.PLANE_THRESHOLD;
    case 'xz':
      return Math.abs(basePoint.y) < CubeValidator.PLANE_THRESHOLD;
    case 'yz':
      return Math.abs(basePoint.x) < CubeValidator.PLANE_THRESHOLD;
    default:
      return false;
    }
  }

  // Check if cube intersects axis at given distance
  public intersectsAxisAtDistance(
    cube: Cube,
    axis: 'x' | 'y' | 'z',
    distance: number,
  ): boolean {
    const { basePoint, sideLength } = cube;
    switch (axis) {
    case 'x':
      return basePoint.x <= distance && basePoint.x + sideLength >= distance;
    case 'y':
      return basePoint.y <= distance && basePoint.y + sideLength >= distance;
    case 'z':
      return basePoint.z <= distance && basePoint.z + sideLength >= distance;
    default:
      return false;
    }
  }

  // Cubes are always axis-aligned
  public isAxisAligned(): boolean {
    return true;
  }
}
