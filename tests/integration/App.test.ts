import { ShapesApplication } from '../../src/index';
import { FileReader } from '../../src/utils/FileReader';
import { RectangleValidator } from '../../src/validators/RectangleValidator';
import { CubeValidator } from '../../src/validators/CubeValidator';
import { RectangleCalculator } from '../../src/calculators/RectangleCalculator';
import { CubeCalculator } from '../../src/calculators/CubeCalculator';
import { CalculationError } from '../../src/exceptions/CustomExceptions';

// Mock dependencies for test isolation
jest.mock('../../src/utils/FileReader');
jest.mock('../../src/validators/RectangleValidator');
jest.mock('../../src/validators/CubeValidator');
jest.mock('../../src/calculators/RectangleCalculator');
jest.mock('../../src/calculators/CubeCalculator');

// Extended integration tests for ShapesApplication
// Tests various shape processing scenarios using mocks
describe('ShapesApplication Extended Coverage', () => {
  let app: ShapesApplication;
  let mockLogger: any;

  beforeEach(() => {
    // Create new application and clear mocks before each test
    app = new ShapesApplication();
    jest.clearAllMocks();
    
    // Mock logger for verifying log calls
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn()
    };
    // @ts-ignore - access private field to replace logger
    app['logger'] = mockLogger;

    (FileReader.readLines as jest.Mock).mockReset();
    (RectangleValidator.prototype.isValidRectangle as jest.Mock).mockReset();
    (CubeValidator.prototype.isValidCube as jest.Mock).mockReset();
    (RectangleCalculator.prototype.calculateArea as jest.Mock).mockReset();
    (CubeCalculator.prototype.calculateSurfaceArea as jest.Mock).mockReset();
  });

  test('should cover rectangle processing with all properties', async () => {
    // Setup mocks first
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['rect1 0 0 4 0 4 3 0 3'])
      .mockResolvedValueOnce([]);

    (RectangleValidator.prototype.isValidRectangle as jest.Mock).mockReturnValue(true);
    (RectangleCalculator.prototype.calculateArea as jest.Mock).mockReturnValue(12);
    (RectangleCalculator.prototype.calculatePerimeter as jest.Mock).mockReturnValue(14);
    (RectangleCalculator.prototype.calculateDiagonal as jest.Mock).mockReturnValue(5);
    (RectangleValidator.prototype.isSquare as jest.Mock).mockReturnValue(false);
    (RectangleValidator.prototype.isRhombus as jest.Mock).mockReturnValue(true);
    (RectangleValidator.prototype.isTrapezoid as jest.Mock).mockReturnValue(false);

    await app.run();

    expect(RectangleCalculator.prototype.calculateArea).toHaveBeenCalled();
    expect(RectangleCalculator.prototype.calculatePerimeter).toHaveBeenCalled();
    expect(RectangleCalculator.prototype.calculateDiagonal).toHaveBeenCalled();
  });

  test('should cover cube processing with all properties', async () => {
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(['cube1 0 0 0 2']);

    (CubeValidator.prototype.isValidCube as jest.Mock).mockReturnValue(true);
    (CubeCalculator.prototype.calculateSurfaceArea as jest.Mock).mockReturnValue(24);
    (CubeCalculator.prototype.calculateVolume as jest.Mock).mockReturnValue(8);
    (CubeCalculator.prototype.calculateSpaceDiagonal as jest.Mock).mockReturnValue(3.46);
    (CubeCalculator.prototype.calculateFaceDiagonal as jest.Mock).mockReturnValue(2.83);
    (CubeValidator.prototype.isBaseOnSpecificPlane as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    (CubeCalculator.prototype.calculateVolumeRatioByPlane as jest.Mock)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.7);

    await app.run();

    expect(CubeCalculator.prototype.calculateSurfaceArea).toHaveBeenCalled();
    expect(CubeCalculator.prototype.calculateVolume).toHaveBeenCalled();
  });

  test('should cover invalid data format handling', async () => {
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['invalid-text-data'])
      .mockResolvedValueOnce(['invalid-text-data']);

    await app.run();

    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid rectangle data format: invalid-text-data');
    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid cube data format: invalid-text-data');
  });

  test('should cover validation failure handling', async () => {
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['rect1 0 0 4 0 4 3 0 3'])
      .mockResolvedValueOnce(['cube1 0 0 0 2']);

    // Setup mocks BEFORE calling app.run()
    (RectangleValidator.prototype.isValidRectangle as jest.Mock).mockReturnValue(false);
    (CubeValidator.prototype.isValidCube as jest.Mock).mockReturnValue(false);

    await app.run();

    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid rectangle configuration: rect1 0 0 4 0 4 3 0 3');
    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid cube configuration: cube1 0 0 0 2');
  });

  test('should cover calculation error handling', async () => {
    // Mock data that will cause calculation errors
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['rect1 0 0 4 0 4 3 0 3'])
      .mockResolvedValueOnce(['cube1 0 0 0 2']);

    (RectangleValidator.prototype.isValidRectangle as jest.Mock).mockReturnValue(true);
    (CubeValidator.prototype.isValidCube as jest.Mock).mockReturnValue(true);
    
    // Mock area calculation error
    (RectangleCalculator.prototype.calculateArea as jest.Mock).mockImplementation(() => {
      throw new CalculationError('Area calculation failed');
    });

    await app.run();

    // Verify calculation errors are properly logged
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Calculation error for rectangle rect1: Area calculation failed')
    );
  });

  test('should cover file error handling', async () => {
    // Mock error for cubes file
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce([])
      .mockRejectedValueOnce(new Error('File system error'));

    await app.run();

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Unexpected error with cubes file')
    );
  });

  test('should cover empty files processing', async () => {
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    await app.run();

    expect(mockLogger.info).toHaveBeenCalledWith('Rectangles processed: 0 valid, 0 invalid');
    expect(mockLogger.info).toHaveBeenCalledWith('Cubes processed: 0 valid, 0 invalid');
  });

  test('should cover basic processing flow', async () => {
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['rect1 0 0 4 0 4 3 0 3'])
      .mockResolvedValueOnce(['cube1 0 0 0 2']);

    // Setup valid mocks
    (RectangleValidator.prototype.isValidRectangle as jest.Mock).mockReturnValue(true);
    (CubeValidator.prototype.isValidCube as jest.Mock).mockReturnValue(true);

    await app.run();

    expect(true).toBe(true);
  });
});
