import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';

/**
 * Retrieves an environment variable with type checking and error handling
 *
 * @param key - The key of the environment variable to retrieve
 * @param defaultValue - The default value to return if the environment variable is not found
 * @returns The value of the environment variable or the default value
 */
export default function getEnv<T>(key: string, defaultValue?: T): T {
  const envKey = key.toSnakeCase().toUpperCase();
  const value = process.env[envKey];

  if (value === undefined) {
    if (defaultValue === undefined)
      throw new ServerError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Environment variable ${envKey} is required`,
      );

    return defaultValue;
  }

  if (typeof defaultValue === 'boolean')
    return (value.toLowerCase() === 'true') as T;

  if (typeof defaultValue === 'number') {
    const num = Number(value);
    if (isNaN(num))
      throw new ServerError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Environment variable ${envKey} must be a valid number`,
      );

    return num as T;
  }

  if (Array.isArray(defaultValue))
    return value.split(',').map(item => item.trim()) as T;

  return value as T;
}
