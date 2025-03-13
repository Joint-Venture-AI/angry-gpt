/* eslint-disable no-undef, no-unused-vars */
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import { Request, ErrorRequestHandler } from 'express';
import deleteFile from '../../util/file/deleteFile';
import { createDir } from '../../util/file/createDir';
import catchAsync from '../../util/server/catchAsync';

/**
 * Image upload middleware using multer.
 *
 * @param {Function} cb - A function to handle uploaded images.
 * @param {boolean} [isOptional=false] - Whether image upload is optional.
 */
const imageUploader = (
  cb: (req: Request, images: string[]) => void,
  isOptional: boolean = false,
) => {
  const baseUploadDir = path.join(process.cwd(), 'uploads');

  createDir(baseUploadDir);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(baseUploadDir, 'images');
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  const fileFilter = (_req: any, file: any, cb: FileFilterCallback) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(
          new ServerError(
            StatusCodes.BAD_REQUEST,
            'Only image files are allowed',
          ),
        );

  const upload = multer({
    storage,
    fileFilter,
  }).fields([{ name: 'images', maxCount: 20 }]); // Allow up to 20 images

  return catchAsync((req, res, next) => {
    upload(req, res, err => {
      if (err)
        throw new ServerError(
          StatusCodes.BAD_REQUEST,
          err.message || 'File upload failed',
        );

      const uploadedImages = req.files as { images?: Express.Multer.File[] };

      if (
        !uploadedImages ||
        !uploadedImages.images ||
        uploadedImages.images.length === 0
      ) {
        if (!isOptional)
          throw new ServerError(StatusCodes.BAD_REQUEST, 'No images uploaded');

        return next();
      }

      // Extract file paths
      const images: string[] = uploadedImages.images.map(
        file => `/images/${file.filename}`,
      );

      cb(req, images);
      next();
    });
  }, imagesUploadRollback);
};

/** Middleware for rolling back image uploads if an error occurs */
export const imagesUploadRollback: ErrorRequestHandler = (
  err,
  req,
  _,
  next,
) => {
  if (req.files && 'images' in req.files && Array.isArray(req.files.images))
    req.files.images.forEach(
      async ({ filename }) => await deleteFile(`/images/${filename}`),
    );

  next(err);
};

export default imageUploader;
