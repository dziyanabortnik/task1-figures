// Custom exceptions for application error handling
export class ShapeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShapeValidationError';
  }
}

export class FileReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileReadError';
  }
}

export class CalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculationError';
  }
}

export class InvalidDataFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDataFormatError';
  }
}
