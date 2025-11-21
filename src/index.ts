/* eslint-disable no-undef */
import { RectangleFactory } from './factories/RectangleFactory.js';
import { CubeFactory } from './factories/CubeFactory.js';
import { RectangleValidator } from './validators/RectangleValidator.js';
import { CubeValidator } from './validators/CubeValidator.js';
import { RectangleCalculator } from './calculators/RectangleCalculator.js';
import { CubeCalculator } from './calculators/CubeCalculator.js';
import { FileReader } from './utils/FileReader.js';
import { Logger } from './utils/Logger.js';
import {
  ShapeValidationError,
  FileReadError,
  CalculationError,
  InvalidDataFormatError,
} from './exceptions/CustomExceptions.js';

//Main application class - orchestrates all business logic
export class ShapesApplication {
  private readonly logger = Logger.getInstance();
  private readonly rectangleFactory = new RectangleFactory();
  private readonly cubeFactory = new CubeFactory();
  private readonly rectangleValidator = new RectangleValidator();
  private readonly cubeValidator = new CubeValidator();
  private readonly rectangleCalculator = new RectangleCalculator();
  private readonly cubeCalculator = new CubeCalculator();

  // Main application entry point
  public async run(): Promise<void> {
    try {
      this.logger.info('Starting Shapes Application...');
      await this.processRectangles();
      await this.processCubes();
      this.logger.info('Shapes Application completed successfully.');
    } catch (error) {
      this.logger.error(`Application error: ${error}`);
      throw error;
    }
  }

  // Process rectangles from file
  private async processRectangles(): Promise<void> {
    this.logger.info('Processing rectangles...');

    try {
      const lines = await FileReader.readLines('./data/rectangles.txt');
      let validCount = 0;
      let invalidCount = 0;

      for (const line of lines) {
        try {
          if (this.rectangleFactory.validateData(line)) {
            const rectangle = this.rectangleFactory.createFromString(line);

            if (this.rectangleValidator.isValidRectangle(rectangle)) {
              validCount++;
              this.processRectangle(rectangle);
            } else {
              invalidCount++;
              this.logger.warn(`Invalid rectangle configuration: ${line}`);
            }
          } else {
            invalidCount++;
            this.logger.warn(`Invalid rectangle data format: ${line}`);
          }
        } catch (error) {
          invalidCount++;
          this.handleProcessingError(error, line, 'rectangle');
        }
      }

      this.logger.info(
        `Rectangles processed: ${validCount} valid, ${invalidCount} invalid`,
      );
    } catch (error) {
      this.handleFileError(error, 'rectangles');
    }
  }

  // Process cubes from file
  private async processCubes(): Promise<void> {
    this.logger.info('Processing cubes...');

    try {
      const lines = await FileReader.readLines('./data/cubes.txt');
      let validCount = 0;
      let invalidCount = 0;

      for (const line of lines) {
        try {
          if (this.cubeFactory.validateData(line)) {
            const cube = this.cubeFactory.createFromString(line);

            if (this.cubeValidator.isValidCube(cube)) {
              validCount++;
              this.processCube(cube);
            } else {
              invalidCount++;
              this.logger.warn(`Invalid cube configuration: ${line}`);
            }
          } else {
            invalidCount++;
            this.logger.warn(`Invalid cube data format: ${line}`);
          }
        } catch (error) {
          invalidCount++;
          this.handleProcessingError(error, line, 'cube');
        }
      }

      this.logger.info(
        `Cubes processed: ${validCount} valid, ${invalidCount} invalid`,
      );
    } catch (error) {
      this.handleFileError(error, 'cubes');
    }
  }

  // Process single rectangle - calculate properties and log results
  private processRectangle(rectangle: any): void {
    try {
      const area = this.rectangleCalculator.calculateArea(rectangle);
      const perimeter = this.rectangleCalculator.calculatePerimeter(rectangle);
      const diagonal = this.rectangleCalculator.calculateDiagonal(rectangle);

      const isSquare = this.rectangleValidator.isSquare(rectangle);
      const isRhombus = this.rectangleValidator.isRhombus(rectangle);
      const isTrapezoid = this.rectangleValidator.isTrapezoid(rectangle);

      this.logRectangleResults(
        rectangle.id,
        area,
        perimeter,
        diagonal,
        isSquare,
        isRhombus,
        isTrapezoid,
      );
    } catch (error) {
      this.handleCalculationError(error, rectangle.id, 'rectangle');
    }
  }

  // Process single cube - calculate properties and log results
  private processCube(cube: any): void {
    try {
      const surfaceArea = this.cubeCalculator.calculateSurfaceArea(cube);
      const volume = this.cubeCalculator.calculateVolume(cube);
      const spaceDiagonal = this.cubeCalculator.calculateSpaceDiagonal(cube);
      const faceDiagonal = this.cubeCalculator.calculateFaceDiagonal(cube);

      const isOnXYPlane = this.cubeValidator.isBaseOnSpecificPlane(cube, 'xy');
      const isOnXZPlane = this.cubeValidator.isBaseOnSpecificPlane(cube, 'xz');
      const isOnYZPlane = this.cubeValidator.isBaseOnSpecificPlane(cube, 'yz');

      const volumeRatioXY = this.cubeCalculator.calculateVolumeRatioByPlane(
        cube,
        'xy',
      );
      const volumeRatioXZ = this.cubeCalculator.calculateVolumeRatioByPlane(
        cube,
        'xz',
      );
      const volumeRatioYZ = this.cubeCalculator.calculateVolumeRatioByPlane(
        cube,
        'yz',
      );

      this.logCubeResults(
        cube.id,
        surfaceArea,
        volume,
        spaceDiagonal,
        faceDiagonal,
        isOnXYPlane,
        isOnXZPlane,
        isOnYZPlane,
        volumeRatioXY,
        volumeRatioXZ,
        volumeRatioYZ,
      );
    } catch (error) {
      this.handleCalculationError(error, cube.id, 'cube');
    }
  }

  // Log rectangle analysis results
  private logRectangleResults(
    id: string,
    area: number,
    perimeter: number,
    diagonal: number,
    isSquare: boolean,
    isRhombus: boolean,
    isTrapezoid: boolean,
  ): void {
    this.logger.info(
      {
        shape: 'Rectangle',
        id,
        area: area.toFixed(2),
        perimeter: perimeter.toFixed(2),
        diagonal: diagonal.toFixed(2),
        isSquare,
        isRhombus,
        isTrapezoid,
      },
      'Rectangle analysis completed',
    );
  }

  // Log cube analysis results
  private logCubeResults(
    id: string,
    surfaceArea: number,
    volume: number,
    spaceDiagonal: number,
    faceDiagonal: number,
    isOnXYPlane: boolean,
    isOnXZPlane: boolean,
    isOnYZPlane: boolean,
    volumeRatioXY: number,
    volumeRatioXZ: number,
    volumeRatioYZ: number,
  ): void {
    this.logger.info(
      {
        shape: 'Cube',
        id,
        surfaceArea: surfaceArea.toFixed(2),
        volume: volume.toFixed(2),
        spaceDiagonal: spaceDiagonal.toFixed(2),
        faceDiagonal: faceDiagonal.toFixed(2),
        isOnXYPlane,
        isOnXZPlane,
        isOnYZPlane,
        volumeRatioXY: volumeRatioXY.toFixed(3),
        volumeRatioXZ: volumeRatioXZ.toFixed(3),
        volumeRatioYZ: volumeRatioYZ.toFixed(3),
      },
      'Cube analysis completed',
    );
  }

  // Handle processing errors for individual shapes
  private handleProcessingError(
    error: unknown,
    data: string,
    shapeType: string,
  ): void {
    if (
      error instanceof ShapeValidationError ||
      error instanceof InvalidDataFormatError
    ) {
      this.logger.warn(
        `Skipping invalid ${shapeType}: ${error.message}. Data: ${data}`,
      );
    } else {
      this.logger.error(
        `Unexpected error processing ${shapeType}: ${error}. Data: ${data}`,
      );
    }
  }

  // Handle file reading errors
  private handleFileError(error: unknown, fileType: string): void {
    if (error instanceof FileReadError) {
      this.logger.error(`Error reading ${fileType} file: ${error.message}`);
    } else {
      this.logger.error(`Unexpected error with ${fileType} file: ${error}`);
    }
  }

  // Handle calculation errors
  private handleCalculationError(
    error: unknown,
    shapeId: string,
    shapeType: string,
  ): void {
    if (error instanceof CalculationError) {
      this.logger.error(
        `Calculation error for ${shapeType} ${shapeId}: ${error.message}`,
      );
    } else {
      this.logger.error(
        `Unexpected calculation error for ${shapeType} ${shapeId}: ${error}`,
      );
    }
  }
}

// Application entry point when run directly
if (require.main === module) {
  const app = new ShapesApplication();
  app.run().catch((error) => {
    console.error('Fatal application error:', error);
    process.exit(1);
  });
}
