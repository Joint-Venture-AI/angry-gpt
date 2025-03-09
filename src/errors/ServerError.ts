/* eslint-disable no-unused-vars */
class ServerError extends Error {
  constructor(
    public readonly statusCode: number,
    message = 'An error occurred',
    stack?: string,
  ) {
    super(message);
    this.name = 'ServerError';

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}

export default ServerError;
