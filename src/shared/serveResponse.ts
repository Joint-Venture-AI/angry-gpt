import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

type Pagination = {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
};

type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: Record<string, unknown> & { pagination?: Pagination };
  data?: T;
};

/**
 * Sends a standardized API response with consistent formatting
 * including success status, message, metadata and optional data payload
 */
const serveResponse = <T>(
  res: Response,
  {
    statusCode = StatusCodes.OK,
    success = true,
    message = 'Success',
    meta,
    data,
  }: Partial<ApiResponse<T>> = {},
): void => {
  res.status(statusCode).json({ success, statusCode, message, meta, data });
};

export default serveResponse;
