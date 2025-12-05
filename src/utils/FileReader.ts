import { readFile } from 'fs/promises';
import { FileReadError } from '../exceptions/CustomExceptions';

// Utility for reading and parsing shape data files
export class FileReader {
  // Read file and return non-empty lines without comments
  public static async readLines(filePath: string): Promise<string[]> {
    try {
      const content = await readFile(filePath, 'utf-8');

      const lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
      
      return lines;
    } catch (error) {
      if (error instanceof Error) {
        throw new FileReadError(`Failed to read file: ${filePath}. Error: ${error.message}`);
      }
      throw new FileReadError(`Failed to read file: ${filePath}`);
    }
  }
}
