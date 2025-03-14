import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import RoutesV1 from './routes/v1';
import { Morgan } from './util/logger/morgen';
import cookieParser from 'cookie-parser';
import ServerError from './errors/ServerError';
import serveResponse from './util/server/serveResponse';
import config from './config';
// import { AuthTemplates } from './app/modules/auth/Auth.template';

/**
 * The main application instance
 *
 * This is the main application instance that sets up the Express server.
 * It configures middleware, routes, and error handling.
 */
const app = express();

// Serve static files
app.use(express.static('uploads'), express.static('public'));

// Configure middleware
app.use(
  cors({
    origin: config.allowed_origins,
    credentials: true,
  }),

  Morgan.successHandler,
  Morgan.errorHandler,

  express.json(),
  express.text(),
  express.urlencoded({ extended: true }),
  cookieParser(),
);

// Health check endpoint
app.get('/', (_, res) => {
  serveResponse(res, {
    message: `${config.server.name} is running successfully. Please check the documentation for more details.`,
  });

  // res.send(AuthTemplates.otp('Soham', '123456'));
});

// API routes
app.use('/api/v1', RoutesV1);

// 404 handler
app.use(({ originalUrl }, _, next) => {
  next(
    new ServerError(StatusCodes.NOT_FOUND, `Route not found. ${originalUrl}`),
  );
});

// Error handler
app.use(globalErrorHandler);

export default app;
