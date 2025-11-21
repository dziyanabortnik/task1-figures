import { 
  ShapeValidationError, 
  FileReadError, 
  CalculationError, 
  InvalidDataFormatError 
} from '../../src/exceptions/CustomExceptions';

// Tests for custom exceptions - creation and throwing
describe('Custom Exceptions', () => {
  test('should create exceptions with correct names and messages', () => {
    const errors = [
      new ShapeValidationError('Invalid shape'),
      new FileReadError('File not found'),
      new CalculationError('Calculation failed'),
      new InvalidDataFormatError('Invalid format')
    ];

    errors.forEach(error => {
      expect(error).toBeInstanceOf(Error); // Inherit from Error
      expect(error.message).toBeDefined(); // Have message
      expect(error.name).not.toBe('Error'); // Have own names
    });
  });

  test('should be throwable', () => {
    expect(() => { throw new ShapeValidationError('Test'); })
      .toThrow(ShapeValidationError);
    expect(() => { throw new FileReadError('Test'); })
      .toThrow(FileReadError);
  });
});
