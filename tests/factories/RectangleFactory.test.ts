import { RectangleFactory } from "../../src/factories/RectangleFactory";
import { Rectangle } from "../../src/entities/Rectangle";
import { Point } from "../../src/entities/Point";
import { InvalidDataFormatError } from "../../src/exceptions/CustomExceptions";

describe("RectangleFactory", () => {
  const factory = new RectangleFactory();

  test("should validate and create rectangle from correct data", () => {
    const data = "rect1 0 0 4 0 4 3 0 3";
    expect(factory.validateData(data)).toBe(true);
    
    const rectangle = factory.createFromString(data);
    expect(rectangle.id).toBe("rect1");
    expect(rectangle.point1).toEqual(new Point(0, 0));
    expect(rectangle.point2).toEqual(new Point(4, 0));
    expect(rectangle.point3).toEqual(new Point(4, 3));
    expect(rectangle.point4).toEqual(new Point(0, 3));
  });

  test("should handle decimal coordinates", () => {
    const data = "rect2 1.5 2.5 5.5 2.5 5.5 4.5 1.5 4.5";
    expect(factory.validateData(data)).toBe(true);
    
    const rectangle = factory.createFromString(data);
    expect(rectangle.point1.x).toBe(1.5);
    expect(rectangle.point1.y).toBe(2.5);
  });

  test("should handle negative coordinates", () => {
    const data = "rect3 -1 -1 2 -1 2 2 -1 2";
    expect(factory.validateData(data)).toBe(true);
    
    const rectangle = factory.createFromString(data);
    expect(rectangle.point1.x).toBe(-1);
    expect(rectangle.point1.y).toBe(-1);
  });

  test("should skip comments and empty lines", () => {
    expect(factory.validateData("# Comment line")).toBe(false);
    expect(factory.validateData("")).toBe(false);
  });

  test("should throw error for invalid format", () => {
    expect(factory.validateData("invalid data")).toBe(false);
    expect(() => factory.createFromString("invalid data")).toThrow(InvalidDataFormatError);
  });

  test("should throw error for insufficient points", () => {
    const invalidData = "rect1 0 0 4 0 4 3";
    expect(factory.validateData(invalidData)).toBe(false);
  });

  test("should throw error for non-numeric values", () => {
    const data = "rect1 a 0 4 0 4 3 0 3";
    expect(factory.validateData(data)).toBe(false);
  });

  test("should handle whitespace", () => {
    const data = "  rect1  0  0  4  0  4  3  0  3  ";
    expect(factory.validateData(data)).toBe(true);
    
    const rectangle = factory.createFromString(data);
    expect(rectangle.id).toBe("rect1");
  });
});
