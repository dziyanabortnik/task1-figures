import { CubeValidator } from '../../src/validators/CubeValidator';
import { Cube } from '../../src/entities/Cube';
import { Point } from '../../src/entities/Point';

// Tests for CubeValidator - validates cube properties and positioning
describe('CubeValidator', () => {
  const validator = new CubeValidator();

  test('should validate correct cube', () => {
    const cube = new Cube('test', new Point(0, 0, 0), 5);
    expect(validator.isValidCube(cube)).toBe(true);
  });

  test('should invalidate cube with zero side length', () => {
    const cube = new Cube('test', new Point(0, 0, 0), 0);
    expect(validator.isValidCube(cube)).toBe(false);
  });

  test('should invalidate cube with negative side length', () => {
    const cube = new Cube('test', new Point(0, 0, 0), -5);
    expect(validator.isValidCube(cube)).toBe(false);
  });

  test('should detect cube on coordinate plane', () => {
    const cubeOnXY = new Cube('test', new Point(0, 0, 0), 2);
    const cubeOnXZ = new Cube('test', new Point(0, 0, 0), 2);
    const cubeOnYZ = new Cube('test', new Point(0, 0, 0), 2);

    expect(validator.isBaseOnCoordinatePlane(cubeOnXY)).toBe(true);
    expect(validator.isBaseOnSpecificPlane(cubeOnXY, 'xy')).toBe(true);
    expect(validator.isBaseOnSpecificPlane(cubeOnXZ, 'xz')).toBe(true);
    expect(validator.isBaseOnSpecificPlane(cubeOnYZ, 'yz')).toBe(true);
  });

  test('should detect cube not on coordinate plane', () => {
    const cube = new Cube('test', new Point(1, 1, 1), 2);
    expect(validator.isBaseOnCoordinatePlane(cube)).toBe(false);
    expect(validator.isBaseOnSpecificPlane(cube, 'xy')).toBe(false);
  });

  test('should check axis intersection', () => {
    const cube = new Cube('test', new Point(1, 1, 1), 2);
    
    expect(validator.intersectsAxisAtDistance(cube, 'x', 2)).toBe(true);
    expect(validator.intersectsAxisAtDistance(cube, 'x', 0)).toBe(false);
    expect(validator.intersectsAxisAtDistance(cube, 'y', 2.5)).toBe(true);
    expect(validator.intersectsAxisAtDistance(cube, 'z', 3)).toBe(true);
  });

  test('should return true for axis aligned cube', () => {
    expect(validator.isAxisAligned()).toBe(true);
  });
});
