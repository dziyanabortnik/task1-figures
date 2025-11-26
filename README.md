# Shapes Application

## Project Description

An application for working with geometric shapes (Rectangle and Cube) with capabilities for calculating their parameters, validation, and analysis. The project is implemented according to variants 2 and 5 of the assignment.

## Functionality

### Rectangle (Variant 2)
- Area and perimeter calculation
- Rectangle validity check
- Shape type identification (square, rhombus, trapezoid)
- Convex quadrilateral verification
- Axis intersection detection

### Cube (Variant 5)
- Surface area and volume calculation
- Volume ratio calculation when intersected by coordinate planes
- Cube validity check
- Position relative to coordinate planes
- Space and face diagonals calculation

## Technologies

- **TypeScript** - static typing
- **Jest** - unit testing
- **Pino** - logging
- **ESLint** - code style (Airbnb config)
- **Factory Method** - object creation pattern

## Installation and Usage

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Application

```bash
npm start
```

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Code Style Check
```bash
npm run lint
```

## Project Structure

src/
├── entities/          # Shape classes
├── calculators/       # Calculation logic  
├── factories/         # Object creation
├── validators/        # Data validation
├── utils/            # Utilities
└── exceptions/       # Custom errors

## Features
- Full test coverage (50+ tests)
- Error handling for invalid data
- File-based input with validation
- Comprehensive logging
- Type-safe implementation