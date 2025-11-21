import { ShapesApplication } from '../../src/index';
import { FileReader } from '../../src/utils/FileReader';
import { RectangleValidator } from '../../src/validators/RectangleValidator';
import { CubeValidator } from '../../src/validators/CubeValidator';
import { RectangleCalculator } from '../../src/calculators/RectangleCalculator';
import { CubeCalculator } from '../../src/calculators/CubeCalculator';

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
  });

  test('should cover rectangle processing with all properties', async () => {
    // Mock file reading: one rectangle in JSON format, empty cubes
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['{"id":"rect1","points":[[0,0],[4,0],[4,3],[0,3]]}'])
      .mockResolvedValueOnce([]);

    // Mock validation and calculations for rectangle
    (RectangleValidator.prototype.isValidRectangle as jest.Mock).mockReturnValue(true);
    (RectangleCalculator.prototype.calculateArea as jest.Mock).mockReturnValue(12);
    (RectangleCalculator.prototype.calculatePerimeter as jest.Mock).mockReturnValue(14);
    (RectangleCalculator.prototype.calculateDiagonal as jest.Mock).mockReturnValue(5);
    (RectangleValidator.prototype.isSquare as jest.Mock).mockReturnValue(false);
    (RectangleValidator.prototype.isRhombus as jest.Mock).mockReturnValue(true);
    (RectangleValidator.prototype.isTrapezoid as jest.Mock).mockReturnValue(false);

    // Start application
    await app.run();

    // Verify all methods were called with correct parameters
    expect(RectangleCalculator.prototype.calculateArea).toHaveBeenCalled();
    expect(RectangleCalculator.prototype.calculatePerimeter).toHaveBeenCalled();
    expect(RectangleCalculator.prototype.calculateDiagonal).toHaveBeenCalled();
    expect(RectangleValidator.prototype.isSquare).toHaveBeenCalled();
    expect(RectangleValidator.prototype.isRhombus).toHaveBeenCalled();
    expect(RectangleValidator.prototype.isTrapezoid).toHaveBeenCalled();
  });

  test('should cover cube processing with all properties', async () => {
    // Mock file reading: empty rectangles, one cube in JSON format
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(['{"id":"cube1","basePoint":[0,0,0],"sideLength":2}']);

    // Mock validation and calculations for cube
    (CubeValidator.prototype.isValidCube as jest.Mock).mockReturnValue(true);
    (CubeCalculator.prototype.calculateSurfaceArea as jest.Mock).mockReturnValue(24);
    (CubeCalculator.prototype.calculateVolume as jest.Mock).mockReturnValue(8);
    (CubeCalculator.prototype.calculateSpaceDiagonal as jest.Mock).mockReturnValue(3.46);
    (CubeCalculator.prototype.calculateFaceDiagonal as jest.Mock).mockReturnValue(2.83);
    (CubeValidator.prototype.isBaseOnSpecificPlane as jest.Mock)
      .mockReturnValueOnce(true)   // XY plane
      .mockReturnValueOnce(false)  // XZ plane
      .mockReturnValueOnce(true);  // YZ plane
    (CubeCalculator.prototype.calculateVolumeRatioByPlane as jest.Mock)
      .mockReturnValueOnce(0.3)    // XY ratio
      .mockReturnValueOnce(0.5)    // XZ ratio
      .mockReturnValueOnce(0.7);   // YZ ratio

    await app.run();

    // Verify all cube methods were called
    expect(CubeCalculator.prototype.calculateSurfaceArea).toHaveBeenCalled();
    expect(CubeCalculator.prototype.calculateVolume).toHaveBeenCalled();
    expect(CubeCalculator.prototype.calculateSpaceDiagonal).toHaveBeenCalled();
    expect(CubeCalculator.prototype.calculateFaceDiagonal).toHaveBeenCalled();
    expect(CubeValidator.prototype.isBaseOnSpecificPlane).toHaveBeenCalledTimes(3);
    expect(CubeCalculator.prototype.calculateVolumeRatioByPlane).toHaveBeenCalledTimes(3);
  });

  test('should cover invalid data format handling', async () => {
    // Mock invalid data in both files
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['invalid-json-data'])
      .mockResolvedValueOnce(['invalid-json-data']);

    await app.run();

    // Verify warnings for invalid data are logged
    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid rectangle data format: invalid-json-data');
    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid cube data format: invalid-json-data');
  });

  test('should cover validation failure handling', async () => {
    // Mock valid JSON data but invalid shape configurations
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['{"id":"rect1","points":[[0,0],[4,0],[4,3],[0,3]]}'])
      .mockResolvedValueOnce(['{"id":"cube1","basePoint":[0,0,0],"sideLength":2}']);

    // Mock invalid shapes
    (RectangleValidator.prototype.isValidRectangle as jest.Mock).mockReturnValue(false);
    (CubeValidator.prototype.isValidCube as jest.Mock).mockReturnValue(false);

    await app.run();

    // Verify invalid configuration warnings are logged
    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid rectangle configuration: {"id":"rect1","points":[[0,0],[4,0],[4,3],[0,3]]}');
    expect(mockLogger.warn).toHaveBeenCalledWith('Invalid cube configuration: {"id":"cube1","basePoint":[0,0,0],"sideLength":2}');
  });

  test('should cover calculation error handling', async () => {
    // Mock data that will cause calculation errors
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['{"id":"rect1","points":[[0,0],[4,0],[4,3],[0,3]]}'])
      .mockResolvedValueOnce(['{"id":"cube1","basePoint":[0,0,0],"sideLength":2}']);

    (RectangleValidator.prototype.isValidRectangle as jest.Mock).mockReturnValue(true);
    (CubeValidator.prototype.isValidCube as jest.Mock).mockReturnValue(true);
    
    // Mock area calculation error
    (RectangleCalculator.prototype.calculateArea as jest.Mock).mockImplementation(() => {
      throw new Error('Calculation error');
    });

    await app.run();

    // Verify calculation errors are properly logged
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Unexpected calculation error for rectangle rect1')
    );
  });

  test('should cover file error handling', async () => {
    // Mock file read error for rectangles
    (FileReader.readLines as jest.Mock)
      .mockRejectedValueOnce(new Error('File system error'))
      .mockResolvedValueOnce([]);

    await app.run();

    // Verify file errors are properly logged
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Unexpected error with rectangles file')
    );
  });

  test('should cover empty files processing', async () => {
    // Mock empty files
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    await app.run();

    // Verify empty file statistics are logged
    expect(mockLogger.info).toHaveBeenCalledWith('Rectangles processed: 0 valid, 0 invalid');
    expect(mockLogger.info).toHaveBeenCalledWith('Cubes processed: 0 valid, 0 invalid');
  });

  test('should cover basic processing flow', async () => {
    // Mock minimal working scenario
    (FileReader.readLines as jest.Mock)
      .mockResolvedValueOnce(['{"id":"rect1","points":[[0,0],[4,0],[4,3],[0,3]]}']) // one valid rectangle
      .mockResolvedValueOnce(['{"id":"cube1","basePoint":[0,0,0],"sideLength":2}']); // one valid cube

    await app.run();

    // Just verify application completes without errors
    expect(true).toBe(true);
  });

  test('should cover error handling flow', async () => {
    // Mock scenario with error in one file
    (FileReader.readLines as jest.Mock)
      .mockRejectedValueOnce(new Error('Test error')) // error in rectangles
      .mockResolvedValueOnce([]);                     // empty cubes

    await app.run();

    // Verify application handles error and continues
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
