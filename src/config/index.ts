import './configure';
import env from '../util/env/env';
import type ms from 'ms';
import { genSecret } from '../util/jwt/genSecret';

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
    name: env<string>('name', 'Project Name'),
  },
  url: {
    database: env<string>('database url', 'mongodb://localhost:27017'),
    reset_pass_ui: env<string>(
      'reset pass ui link',
      'https://example.com/reset-pass-ui',
    ),
    payment: {
      success: env<string>(
        'payment success url',
        'https://example.com/payment/success',
      ),
      cancel: env<string>(
        'payment cancel url',
        'https://example.com/payment/cancel',
      ),
    },
  },
  allowed_origins: env<string[]>('allowed origins', ['*']),
  bcrypt_salt_rounds: env<number>('bcrypt salt rounds', 10),
  jwt: {
    access_token: {
      secret: env<string>('jwt secret', genSecret()),
      expire_in: env<ms.StringValue>('jwt expire in', '1h'),
    },
    refresh_token: {
      secret: env<string>('jwt refresh secret', genSecret()),
      expire_in: env<ms.StringValue>('jwt refresh expire in', '1d'),
    },
  },
  payment: {
    stripe: {
      key: env<string>(
        'stripe api key',
        'sk_test_51O5555555555555555555555555555555',
      ),
      secret: env<string>(
        'stripe api secret',
        'sk_test_51O5555555555555555555555555555555',
      ),
      webhook: env<string>(
        'stripe webhook secret',
        'whsec_51O5555555555555555555555555555555',
      ),
    },
  },
  email: {
    from: env<string>('email from', 'Project Name <project@example.com>'),
    user: env<string>('email user', 'project@example.com'),
    port: env<number>('email port', 587),
    host: env<string>('email host', 'smtp.example.com'),
    pass: env<string>('email pass', 'password'),
  },
  admin: {
    email: env<string>('admin email', 'admin@example.com'),
    password: env<string>('admin password', 'password'),
  },
};
