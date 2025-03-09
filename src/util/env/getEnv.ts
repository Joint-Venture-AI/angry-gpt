import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';

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
