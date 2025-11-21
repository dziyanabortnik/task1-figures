import { RectangleValidator } from "../../src/validators/RectangleValidator";
import { Rectangle } from "../../src/entities/Rectangle";
import { Point } from "../../src/entities/Point";

// Tests for RectangleValidator - rectangle validation and type checking
describe("RectangleValidator", () => {
  const validator = new RectangleValidator();

  // Helper functions for creating different quadrilaterals
  const createSquare = (): Rectangle => {
    return new Rectangle(
      "square",
      new Point(0, 0),
      new Point(3, 0),
      new Point(3, 3),
      new Point(0, 3)
    );
  };

  const createRhombus = (): Rectangle => {
    return new Rectangle(
      "rhombus",
      new Point(0, 0),
      new Point(2, 3),
      new Point(4, 0),
      new Point(2, -3)
    );
  };

  const createTrapezoid = (): Rectangle => {
    return new Rectangle(
      "trapezoid",
      new Point(0, 0),
      new Point(4, 0),
      new Point(3, 3),
      new Point(1, 3)
    );
  };

  const createRectangle = (): Rectangle => {
    return new Rectangle(
      "rectangle",
      new Point(0, 0),
      new Point(4, 0),
      new Point(4, 3),
      new Point(0, 3)
    );
  };

  test("should validate rectangle and check properties", () => {
    const rectangle = createRectangle();
    expect(validator.isValidRectangle(rectangle)).toBe(true);
    expect(validator.isSquare(rectangle)).toBe(false); // Not a square
    expect(validator.isAxisAligned(rectangle)).toBe(true); // Axis aligned
  });

  test("should identify different rectangle types", () => {
    const square = createSquare();
    const rhombus = createRhombus();
    const trapezoid = createTrapezoid();

    expect(validator.isSquare(square)).toBe(true); // Square
    expect(validator.isRhombus(rhombus)).toBe(true); // Rhombus
    expect(validator.isTrapezoid(trapezoid)).toBe(true); // Trapezoid
  });

  test("should check axis intersection and alignment", () => {
    const rectangle = createRectangle();
    
    expect(validator.intersectsAxisAtDistance(rectangle, "x", 2)).toBe(true); // Intersects X axis
    expect(validator.intersectsAxisAtDistance(rectangle, "x", 5)).toBe(false); // Doesn't intersect X axis
    expect(validator.isAxisAligned(rectangle)).toBe(true); // Axis aligned
  });

  test("should invalidate rectangle with duplicate points", () => {
    const invalidRectangle = new Rectangle(
      "invalid",
      new Point(0, 0),
      new Point(0, 0), // Duplicate points
      new Point(4, 3),
      new Point(0, 3)
    );
    expect(validator.isValidRectangle(invalidRectangle)).toBe(false);
  });

  test("should invalidate non-convex quadrilateral", () => {
    const nonConvex = new Rectangle(
      "nonconvex",
      new Point(0, 0),
      new Point(4, 0),
      new Point(1, 1),
      new Point(3, 3)
    );
    expect(validator.isValidRectangle(nonConvex)).toBe(false);
  });

  test("should handle non-axis-aligned rectangles", () => {
    const rotatedRectangle = new Rectangle(
      "rotated",
      new Point(0, 0),
      new Point(2, 2),
      new Point(4, 0),
      new Point(2, -2)
    );
    expect(validator.isAxisAligned(rotatedRectangle)).toBe(false); // Not axis aligned
  });
});
