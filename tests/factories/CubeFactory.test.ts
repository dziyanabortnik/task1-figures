import { CubeFactory } from "../../src/factories/CubeFactory";
import { Cube } from "../../src/entities/Cube";
import { Point } from "../../src/entities/Point";
import { InvalidDataFormatError, ShapeValidationError } from "../../src/exceptions/CustomExceptions";

describe("CubeFactory", () => {
  const factory = new CubeFactory();

  test("should validate and create cube from correct data", () => {
    const data = "cube1 0 0 0 2";
    expect(factory.validateData(data)).toBe(true);
    
    const cube = factory.createFromString(data);
    expect(cube.id).toBe("cube1");
    expect(cube.basePoint).toEqual(new Point(0, 0, 0));
    expect(cube.sideLength).toBe(2);
  });

  test("should handle decimal and negative coordinates", () => {
    const data = "cube2 1.5 -2.5 3.5 2.5";
    expect(factory.validateData(data)).toBe(true);
    
    const cube = factory.createFromString(data);
    expect(cube.basePoint.x).toBe(1.5);
    expect(cube.basePoint.y).toBe(-2.5);
    expect(cube.basePoint.z).toBe(3.5);
    expect(cube.sideLength).toBe(2.5);
  });

  test("should skip comments and empty lines", () => {
    expect(factory.validateData("# Comment line")).toBe(false);
    expect(factory.validateData("")).toBe(false);
    expect(factory.validateData("   ")).toBe(false);
  });

  test("should handle edge cases", () => {
    expect(factory.validateData("cube1 0 0 0 0.0001")).toBe(true);
    expect(factory.validateData("cube1 0 0 0 0")).toBe(true);
  });

  test("should throw error for invalid format", () => {
    expect(factory.validateData("invalid data")).toBe(false);
    expect(() => factory.createFromString("invalid data")).toThrow(InvalidDataFormatError);
  });

  test("should throw error for insufficient data", () => {
    const invalidData = "cube1 0 0 0";
    expect(factory.validateData(invalidData)).toBe(false);
  });

  test("should throw error for negative side length", () => {
    const data = "cube1 0 0 0 -2";
    expect(factory.validateData(data)).toBe(true);
    expect(() => factory.createFromString(data)).toThrow(ShapeValidationError);
  });

  test("should throw error for non-numeric values", () => {
    const data = "cube1 a 0 0 2";
    expect(factory.validateData(data)).toBe(false);
  });
});
