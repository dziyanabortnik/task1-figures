import { CubeCalculator } from "../../src/calculators/CubeCalculator";
import { Cube } from "../../src/entities/Cube";
import { Point } from "../../src/entities/Point";
import { CalculationError } from "../../src/exceptions/CustomExceptions";

describe("CubeCalculator", () => {
  const calculator = new CubeCalculator();

  test("should calculate basic properties correctly", () => {
    const cube = new Cube("test", new Point(0, 0, 0), 3);
    
    expect(calculator.calculateSurfaceArea(cube)).toBe(54); // 6 * 3²
    expect(calculator.calculateVolume(cube)).toBe(27);      // 3³
    expect(calculator.calculateSpaceDiagonal(cube)).toBeCloseTo(5.196); // 3√3
    expect(calculator.calculateFaceDiagonal(cube)).toBeCloseTo(4.243);  // 3√2
  });

  test("should throw errors for invalid side lengths", () => {
    const cube = new Cube("test", new Point(0, 0, 0), 0);
    
    expect(() => calculator.calculateSurfaceArea(cube)).toThrow(CalculationError);
    expect(() => calculator.calculateVolume(cube)).toThrow(CalculationError);
  });

  test("should calculate volume ratios for different planes", () => {
    const cube = new Cube("test", new Point(0, 0, 1), 4);
    
    // Cube above XY plane - volume on both sides
    expect(calculator.calculateVolumeRatioByPlane(cube, "xy")).toBeGreaterThan(0);
    // Cube sitting on XZ and YZ planes - all volume on one side
    expect(calculator.calculateVolumeRatioByPlane(cube, "xz")).toBe(0);
    expect(calculator.calculateVolumeRatioByPlane(cube, "yz")).toBe(0);
  });

  test("should throw error for invalid plane", () => {
    const cube = new Cube("test", new Point(0, 0, 0), 2);
    
    expect(() => calculator.calculateVolumeRatioByPlane(cube, "invalid" as any))
      .toThrow(CalculationError);
  });
});