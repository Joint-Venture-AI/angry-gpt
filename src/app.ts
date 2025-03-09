import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import cookieParser from 'cookie-parser';
import ServerError from './errors/ServerError';
import serveResponse from './shared/serveResponse';
import config from './config';

const app = express();

// Serve static files
app.use(express.static('uploads'));

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
    message:
      'Server is running successfully. Please check the documentation for more details.',
  });
});

// API routes
app.use('/api/v1', router);

// 404 handler
app.use(({ originalUrl }, _, next) => {
  next(
    new ServerError(StatusCodes.NOT_FOUND, `Route not found. ${originalUrl}`),
  );
});

// Error handler
app.use(globalErrorHandler);

export default app;
