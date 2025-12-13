import { ShapesApplication } from '../../src/index';

jest.mock('../../src/utils/FileReader.js');
jest.mock('../../src/warehouse/Warehouse.js');
jest.mock('../../src/repository/ShapesRepositoryImpl.js');

describe('ShapesApplication', () => {
  let app: ShapesApplication;

  beforeEach(() => {
    // Сброс всех мок перед каждым тестом
    jest.clearAllMocks();
    
    // Создание мок для Warehouse
    const mockWarehouse = {
      getInstance: jest.fn(() => ({
        clearCache: jest.fn(),
        getCacheStats: jest.fn(),
        getVolume: jest.fn(),
        getArea: jest.fn(),
        getSurfaceArea: jest.fn(),
        getPerimeter: jest.fn(),
        update: jest.fn(),
      })),
    };
    
    // Создание мок для Repository
    const mockRepository = {
      add: jest.fn(),
      remove: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findBySpecification: jest.fn(),
      getCount: jest.fn(),
      clear: jest.fn(),
      getCubes: jest.fn(),
      getRectangles: jest.fn(),
    };

    // Переопределяем моки
    require('../../src/warehouse/Warehouse.js').Warehouse = mockWarehouse;
    require('../../src/repository/ShapesRepositoryImpl.js').ShapesRepository = jest.fn(() => mockRepository);
    
    app = new ShapesApplication();
  });

  test('should initialize correctly', () => {
    expect(app).toBeDefined();
    // @ts-ignore - доступ к приватному полю для теста
    expect(app.getRepository()).toBeDefined();
    // @ts-ignore - доступ к приватному полю для теста
    expect(app.getWarehouse()).toBeDefined();
  });

  test('should have repository methods', () => {
    const repo = app.getRepository();
    expect(typeof repo.add).toBe('function');
    expect(typeof repo.findAll).toBe('function');
  });
});
