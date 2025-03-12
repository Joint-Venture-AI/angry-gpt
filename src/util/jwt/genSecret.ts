import crypto from 'crypto';

/**
 * Generates a random secret key
 *
 * This function generates a random secret key using the crypto module.
 * The key is generated as a hex string of 32 characters.
 */
export const genSecret = () => crypto.randomBytes(32).toString('hex');
