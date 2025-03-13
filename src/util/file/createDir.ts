import fs from 'fs';

/**
 * Creates a directory if it doesn't exist
 *
 * This function checks if a directory exists at the specified path.
 * If it doesn't exist, it creates the directory.
 */
export const createDir = (path: string) =>
  !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true });
