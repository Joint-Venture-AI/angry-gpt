import './configure';
import env from '../util/env/getEnv';
import type ms from 'ms';

/**
 * Configuration object for the application
 *
 * This object contains various configuration settings for the application,
 * including server details, database connection, allowed origins, and authentication settings.
 */
export default {
  server: {
    ip_address: env<string>('ip address', '0.0.0.0'),
    node_env: env<string>('node env', 'development'),
    port: env<number>('port', 3000),
    name: env<string>('name'),
  },
  url: {
    payment: {
      success: env<string>('payment success url'),
      cancel: env<string>('payment cancel url'),
    },
    database: env<string>('database url'),
    reset_pass_ui: env<string>('reset pass ui link'),
  },
  allowed_origins: env<string[]>('allowed origins', []),
  bcrypt_salt_rounds: env<number>('bcrypt salt rounds', 10),
  jwt: {
    access_token: {
      secret: env<string>('jwt secret'),
      expire_in: env<ms.StringValue>('jwt expire in', '1h'),
    },
    refresh_token: {
      secret: env<string>('jwt refresh secret'),
      expire_in: env<ms.StringValue>('jwt refresh expire in', '1d'),
    },
  },
  payment: {
    stripe: {
      key: env<string>('stripe api key'),
      secret: env<string>('stripe api secret'),
      webhook: env<string>('stripe webhook secret'),
    },
  },
  email: {
    from: env<string>('email from'),
    user: env<string>('email user'),
    port: env<number>('email port', 587),
    host: env<string>('email host'),
    pass: env<string>('email pass'),
  },
  admin: {
    email: env<string>('admin email'),
    password: env<string>('admin password'),
  },
};
