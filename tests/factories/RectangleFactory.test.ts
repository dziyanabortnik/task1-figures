import { RectangleFactory } from "../../src/factories/RectangleFactory";
import { Rectangle } from "../../src/entities/Rectangle";
import { Point } from "../../src/entities/Point";
import { InvalidDataFormatError } from "../../src/exceptions/CustomExceptions";

// Tests for RectangleFactory - creates rectangles from JSON data
describe("RectangleFactory", () => {
  const factory = new RectangleFactory();

  test("should validate and create rectangle from correct data", () => {
    const data = '{"id":"rect1","points":[[0,0],[4,0],[4,3],[0,3]]}';
    expect(factory.validateData(data)).toBe(true);
    
    const rectangle = factory.createFromString(data);
    expect(rectangle.id).toBe("rect1");
    expect(rectangle.point1).toEqual(new Point(0, 0));
    expect(rectangle.point2).toEqual(new Point(4, 0));
    expect(rectangle.point3).toEqual(new Point(4, 3));
    expect(rectangle.point4).toEqual(new Point(0, 3));
  });

  test("should handle decimal coordinates", () => {
    const data = '{"id":"rect2","points":[[1.5,2.5],[5.5,2.5],[5.5,4.5],[1.5,4.5]]}';
    expect(factory.validateData(data)).toBe(true);
    
    const rectangle = factory.createFromString(data);
    expect(rectangle.point1.x).toBe(1.5);
    expect(rectangle.point1.y).toBe(2.5);
  });

  test("should handle negative coordinates", () => {
    const data = '{"id":"rect3","points":[[-1,-1],[2,-1],[2,2],[-1,2]]}';
    expect(factory.validateData(data)).toBe(true);
    
    const rectangle = factory.createFromString(data);
    expect(rectangle.point1.x).toBe(-1);
    expect(rectangle.point1.y).toBe(-1);
  });

  test("should throw error for invalid JSON", () => {
    expect(factory.validateData("invalid json")).toBe(false);
    expect(() => factory.createFromString("invalid json")).toThrow(InvalidDataFormatError);
  });

  test("should throw error for missing required fields", () => {
    const invalidData = '{"id":"rect1"}'; // missing points
    expect(factory.validateData(invalidData)).toBe(false);
  });

  test("should throw error for insufficient points", () => {
    const invalidData = '{"id":"rect1","points":[[0,0],[4,0],[4,3]]}'; // only 3 points
    expect(factory.validateData(invalidData)).toBe(false);
  });

  test("should handle whitespace in JSON", () => {
    const data = '  { "id": "rect1", "points": [ [0,0], [4,0], [4,3], [0,3] ] }  ';
    expect(factory.validateData(data)).toBe(true);
    
    const rectangle = factory.createFromString(data);
    expect(rectangle.id).toBe("rect1");
  });
});
