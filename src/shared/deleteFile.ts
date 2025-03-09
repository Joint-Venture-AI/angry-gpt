import fs from 'fs/promises';
import path from 'path';
import { errorLogger, logger } from './logger';
import colors from 'colors';

/**
 * Delete a file from the uploads directory
 * @param file - The file to delete
 */
const deleteFile = async (file: string) => {
  const filePath = path.join(process.cwd(), 'uploads', file);

  logger.info(colors.yellow(`Deleting file: ${filePath}`));
  try {
    await fs.unlink(filePath);
    logger.info(colors.green('File deleted successfully'));
  } catch {
    errorLogger.error(colors.red(`Failed to delete file: ${filePath}`));
  }
};

export default deleteFile;
