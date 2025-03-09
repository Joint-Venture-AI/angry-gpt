import dotenv from 'dotenv';
import { resolve } from 'path';
import env from '../util/env/getEnv';

dotenv.config({ path: resolve(process.cwd(), '.env') });

export default {
  server: {
    ip_address: env<string>('ip address', '0.0.0.0'),
    node_env: env<string>('node env', 'development'),
    port: env<number>('port', 3000),
  },
  url: {
    database: env<string>('database url'),
    reset_pass_ui: env<string>('reset pass ui link'),
  },
  allowed_origins: env<string[]>('allowed origins', []),
  bcrypt_salt_rounds: env<number>('bcrypt salt rounds', 10),
  google_maps: env<string>('google maps'),
  jwt: {
    access_token: {
      secret: env<string>('jwt secret'),
      expire_in: env<string>('jwt expire in'),
    },
    refresh_token: {
      secret: env<string>('jwt refresh secret'),
      expire_in: env<string>('jwt refresh expire in'),
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
