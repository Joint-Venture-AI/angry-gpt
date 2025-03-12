import fs from 'fs';
import { errorLogger } from '../../shared/logger';
import colors from 'colors';
import { envPath } from '../../config/configure';

/**
 * Retrieves an environment variable. If not found, sets it with the default value.
 *
 * @param key - The key of the environment variable
 * @param defaultValue - The default value to use if the variable is missing
 * @returns The value of the environment variable
 */
export default function env<T>(key: string, defaultValue?: T): T {
  const envKey = key.toSnakeCase().toUpperCase();

  try {
    const envData = fs.readFileSync(envPath, 'utf8');

    let value =
      process.env[envKey] ??
      envData.match(new RegExp(`^${envKey}=(.*)`, 'm'))?.[1];

    if (value !== undefined) return parseValue(value, defaultValue);

    errorLogger.error(
      colors.red(`❌ ${envKey} is missing, setting default value`),
      defaultValue,
    );

    value = formatValue(defaultValue);
    const updatedEnv = envData.includes(`${envKey}=`)
      ? envData.replace(new RegExp(`^${envKey}=.*`, 'm'), `${envKey}=${value}`)
      : envData.trim() + `\n${envKey}=${value}\n`;

    fs.writeFileSync(envPath, updatedEnv, 'utf8');
    process.env[envKey] = value;

    return parseValue(value, defaultValue);
  } catch (error) {
    errorLogger.error(
      colors.red('❌ Error getting environment variable'),
      error,
    );

    process.exit(1);
  }
}

/** Parses the retrieved environment value into its correct type */
const parseValue = <T>(value: string, defaultValue?: T): T => {
  if (typeof defaultValue === 'boolean')
    return (value.toLowerCase() === 'true') as T;
  if (typeof defaultValue === 'number')
    return (isNaN(+value) ? defaultValue : +value) as T;
  if (Array.isArray(defaultValue))
    return value.split(',').map(item => item.trim()) as T;
  return value as T;
};

/** Formats the default value correctly for writing to the .env file */
const formatValue = <T>(value: T): string =>
  Array.isArray(value) ? value.join(',') : (value as any).toString();
