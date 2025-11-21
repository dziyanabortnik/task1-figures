import { FileReader } from '../../src/utils/FileReader';
import { FileReadError } from '../../src/exceptions/CustomExceptions';

// Mock fs/promises for file system isolation
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

const { readFile } = require('fs/promises');

// Tests for FileReader - file reading and parsing
describe('FileReader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should read and parse file content correctly', async () => {
    const mockContent = `# Comment line
rect1 0 0 4 0 4 3 0 3
cube1 0 0 0 2`;
    (readFile as jest.Mock).mockResolvedValue(mockContent);

    const lines = await FileReader.readLines('./data/test.txt');
    
    // Comments and empty lines are filtered out
    expect(lines).toEqual([
      'rect1 0 0 4 0 4 3 0 3',
      'cube1 0 0 0 2'
    ]);
  });

  test('should handle empty file and comments', async () => {
    // Test file with only comments and empty lines
    (readFile as jest.Mock).mockResolvedValue('# Only comments\n\n');
    
    const lines = await FileReader.readLines('./data/empty.txt');
    expect(lines).toEqual([]);
  });

  test('should throw FileReadError when file not found', async () => {
    (readFile as jest.Mock).mockRejectedValue(new Error('File not found'));
    
    await expect(FileReader.readLines('./data/nonexistent.txt'))
      .rejects.toThrow(FileReadError);
  });
});
