import { CubeFactory } from "../../src/factories/CubeFactory";
import { Cube } from "../../src/entities/Cube";
import { Point } from "../../src/entities/Point";
import { InvalidDataFormatError, ShapeValidationError } from "../../src/exceptions/CustomExceptions";

// Tests for CubeFactory - creates cubes from JSON data
describe("CubeFactory", () => {
  const factory = new CubeFactory();

  test("should validate and create cube from correct data", () => {
    const data = '{"id":"cube1","basePoint":[0,0,0],"sideLength":2}';
    expect(factory.validateData(data)).toBe(true);
    
    const cube = factory.createFromString(data);
    expect(cube.id).toBe("cube1");
    expect(cube.basePoint).toEqual(new Point(0, 0, 0));
    expect(cube.sideLength).toBe(2);
  });

  test("should handle decimal and negative coordinates", () => {
    const data = '{"id":"cube2","basePoint":[1.5,-2.5,3.5],"sideLength":2.5}';
    expect(factory.validateData(data)).toBe(true);
    
    const cube = factory.createFromString(data);
    expect(cube.basePoint.x).toBe(1.5);
    expect(cube.basePoint.y).toBe(-2.5);
    expect(cube.basePoint.z).toBe(3.5);
    expect(cube.sideLength).toBe(2.5);
  });

  test("should handle various data formats", () => {
    expect(factory.validateData('{"id":"cube1","basePoint":[100,0.25,0],"sideLength":2}')).toBe(true);
    expect(factory.validateData('{"id":"cube1","basePoint":[0,0,0],"sideLength":2}')).toBe(true);
    expect(factory.validateData('  {"id":"cube1","basePoint":[0,0,0],"sideLength":2}  ')).toBe(true);
  });

  test("should handle edge cases", () => {
    expect(factory.validateData('{"id":"cube1","basePoint":[0,0,0],"sideLength":0.0001}')).toBe(true);
    expect(factory.validateData('{"id":"cube1","basePoint":[0,0,0],"sideLength":0}')).toBe(false);
  });

  test("should throw error for invalid JSON", () => {
    expect(factory.validateData("invalid json")).toBe(false);
    expect(() => factory.createFromString("invalid json")).toThrow(InvalidDataFormatError);
  });

  test("should throw error for missing required fields", () => {
    const invalidData = '{"id":"cube1","basePoint":[0,0,0]}'; // missing sideLength
    expect(factory.validateData(invalidData)).toBe(false);
  });

  test("should throw error for negative side length", () => {
    const data = '{"id":"cube1","basePoint":[0,0,0],"sideLength":-2}';
    expect(factory.validateData(data)).toBe(false);
    expect(() => factory.createFromString(data)).toThrow(InvalidDataFormatError);
  });
});
