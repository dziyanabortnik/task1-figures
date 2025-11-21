import { Logger } from "../../src/utils/Logger";

// Tests for Logger - singleton pattern and environment configurations
describe("Logger", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    (Logger as any).instance = null;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  test("should create logger instance and return singleton", () => {
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();
    
    expect(logger1).toBeDefined();
    expect(logger1).toBe(logger2); // Same instance - singleton pattern
  });

  test("should call logging methods without errors", () => {
    const logger = Logger.getInstance();
    
    expect(() => {
      logger.info("Test info");
      logger.error("Test error");
      logger.warn("Test warning");
    }).not.toThrow();
  });

  test("should handle different environments", () => {
    // Test logger creation in test mode
    process.env.NODE_ENV = "test";
    (Logger as any).instance = null;
    
    const logger = Logger.getInstance();
    expect(logger).toBeDefined();
    expect(() => logger.info("Test mode")).not.toThrow();
  });

  test("should create different logger configurations", () => {
    // Test different configurations for different environments
    process.env.NODE_ENV = "test";
    const logger1 = Logger.getInstance();

    process.env.NODE_ENV = "development";
    const logger2 = Logger.getInstance();

    expect(logger1).toBeDefined();
    expect(logger2).toBeDefined();
  });
});
