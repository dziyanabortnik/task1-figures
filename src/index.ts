import { FileReader } from "./utils/FileReader";
import { Logger } from "./utils/Logger";
import { CubeFactory } from "./factories/CubeFactory";
import { RectangleFactory } from "./factories/RectangleFactory";
import { CubeValidator } from "./validators/CubeValidator";
import { RectangleValidator } from "./validators/RectangleValidator";
import { Warehouse } from "./warehouse/Warehouse";
import { ShapesRepository } from "./repository/ShapesRepositoryImpl";
import { FindByQuadrantSpecification } from "./repository/specifications/BasicSpecifications";
import {
  FindByAreaRangeSpecification,
  FindByVolumeRangeSpecification,
} from "./repository/specifications/CalculatedSpecifications";
import {
  ByIdComparator,
  ByAreaComparator,
} from "./repository/comparators/ShapeComparators";
import { SortUtils } from "./repository/SortUtils";
import {
  ShapeValidationError,
  FileReadError,
  InvalidDataFormatError,
} from "./exceptions/CustomExceptions";
import { Cube } from "./entities/Cube";

export class ShapesApplication {
  private readonly logger = Logger.getInstance();
  private readonly rectangleFactory = new RectangleFactory();
  private readonly cubeFactory = new CubeFactory();
  private readonly rectangleValidator = new RectangleValidator();
  private readonly cubeValidator = new CubeValidator();
  private readonly repository = new ShapesRepository();
  private readonly warehouse = Warehouse.getInstance();

  public async run(): Promise<void> {
    try {
      this.logger.info("Starting Updated Shapes Application...");

      // Главный процесс: загрузка - обработка - демонстрация паттернов
      console.log("DESIGN PATTERNS DEMONSTRATION");

      await this.loadShapesFromFiles();
      await this.processShapes();
      this.demoRepositoryFeatures();
      this.demoWarehouseFeatures();

      this.logger.info("Application completed successfully.");
    } catch (error) {
      this.logger.error(`Application error: ${error}`);
      throw error;
    }
  }

  private async loadShapesFromFiles(): Promise<void> {
    this.logger.info("Loading shapes from files...");

    // Factory Pattern: создание объектов из файлов
    await this.loadRectangles();
    await this.loadCubes();

    console.log(`Total shapes loaded: ${this.repository.getCount()}`);
  }

  private async loadRectangles(): Promise<void> {
    try {
      const lines = await FileReader.readLines("./data/rectangles.txt");
      let loaded = 0;

      for (const line of lines) {
        try {
          if (this.rectangleFactory.validateData(line)) {
            const rectangle = this.rectangleFactory.createFromString(line);

            if (this.rectangleValidator.isValidRectangle(rectangle)) {
              // Observer Pattern: привязываем Warehouse к Rectangle
              rectangle.attach(this.warehouse);

              // Repository Pattern: добавляем в хранилище
              this.repository.add(rectangle);

              // Singleton Pattern: Warehouse предварительно кэширует
              this.warehouse.getArea(rectangle);
              this.warehouse.getPerimeter(rectangle);
              loaded++;
            }
          }
        } catch (error) {
          this.handleShapeLoadingError(error, line, "rectangle");
        }
      }

      console.log(`Rectangles loaded: ${loaded}`);
    } catch (error) {
      this.handleFileError(error, "rectangles");
    }
  }

  private async loadCubes(): Promise<void> {
    try {
      const lines = await FileReader.readLines("./data/cubes.txt");
      let loaded = 0;

      for (const line of lines) {
        try {
          if (this.cubeFactory.validateData(line)) {
            const cube = this.cubeFactory.createFromString(line);

            if (this.cubeValidator.isValidCube(cube)) {
              // Observer Pattern: привязываем Warehouse к Cube
              cube.attach(this.warehouse);

              this.repository.add(cube);
              this.warehouse.getSurfaceArea(cube);
              this.warehouse.getVolume(cube);
              loaded++;
            }
          }
        } catch (error) {
          this.handleShapeLoadingError(error, line, "cube");
        }
      }

      console.log(`Cubes loaded: ${loaded}`);
    } catch (error) {
      this.handleFileError(error, "cubes");
    }
  }

  private async processShapes(): Promise<void> {
    this.logger.info("Processing all shapes...");

    const allShapes = this.repository.findAll();
    console.log(`Processed ${allShapes.length} shapes`);
  }

  private demoRepositoryFeatures(): void {
    console.log("REPOSITORY & SPECIFICATION PATTERNS");

    // 1. Repository Pattern: поиск по ID
    const shapeById = this.repository.findById("cube1");
    if (shapeById) {
      console.log(`Found by ID: cube1`);
    }

    // 2. Specification Pattern: поиск в квадранте
    const firstQuadrantSpec = new FindByQuadrantSpecification(1);
    const firstQuadrantShapes =
      this.repository.findBySpecification(firstQuadrantSpec);
    console.log(`Shapes in 1st quadrant: ${firstQuadrantShapes.length}`);

    // 3. Specification Pattern: поиск по площади
    const areaSpec = new FindByAreaRangeSpecification(10, 50);
    const shapesByArea = this.repository.findBySpecification(areaSpec);
    console.log(`Shapes with area 10-50: ${shapesByArea.length}`);

    // 4. Specification Pattern: поиск по объему
    const volumeSpec = new FindByVolumeRangeSpecification(1, 100);
    const shapesByVolume = this.repository.findBySpecification(volumeSpec);
    console.log(`Shapes with volume 1-100: ${shapesByVolume.length}`);

    // 5. Comparator Pattern: сортировка по ID
    const sortedById = SortUtils.sortShapes(
      this.repository.findAll(),
      new ByIdComparator()
    );
    console.log(
      `Sorted by ID: ${sortedById
        .slice(0, 3)
        .map((s) => s.id)
        .join(", ")}...`
    );

    // 6. Comparator Pattern: сортировка по площади
    const sortedByArea = SortUtils.sortShapes(
      this.repository.findAll(),
      new ByAreaComparator()
    );
    console.log("Shapes sorted by area");
  }

  private demoWarehouseFeatures(): void {
    console.log("OBSERVER & SINGLETON PATTERNS");

    const cube = this.repository.findById("cube1");

    if (cube && cube instanceof Cube) {
      const typedCube = cube as Cube;

      // Singleton Pattern: доступ к единственному экземпляру Warehouse
      const volumeBefore = this.warehouse.getVolume(cube);
      console.log(`1. Initial volume: ${volumeBefore.toFixed(2)}`);
      console.log(`2. Side length: ${typedCube.sideLength}`);

      // Observer Pattern: изменение свойства запускает уведомление
      console.log(`3. Changing side to ${typedCube.sideLength + 1}`);
      typedCube.sideLength = typedCube.sideLength + 1;

      // Observer в действии: Warehouse автоматически пересчитывает
      const volumeAfter = this.warehouse.getVolume(cube);
      console.log(`4. New volume: ${volumeAfter.toFixed(2)}`);

      if (Math.abs(volumeAfter - volumeBefore) > 0.01) {
        console.log("OBSERVER WORKS: Warehouse updated automatically!");
      }
    }
  }

  private handleShapeLoadingError(
    error: unknown,
    data: string,
    shapeType: string
  ): void {
    if (
      error instanceof ShapeValidationError ||
      error instanceof InvalidDataFormatError
    ) {
      this.logger.warn(`Skipping invalid ${shapeType}: ${error.message}`);
    }
  }

  private handleFileError(error: unknown, fileType: string): void {
    if (error instanceof FileReadError) {
      this.logger.error(`Error reading ${fileType} file: ${error.message}`);
    }
  }

  //Получить экземпляр Warehouse (для тестирования)
  public getWarehouse(): Warehouse {
    return this.warehouse;
  }

  //Получить репозиторий (для тестирования)
  public getRepository(): ShapesRepository {
    return this.repository;
  }
}
