/* eslint-disable no-undef, no-unused-vars */
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import { Request, ErrorRequestHandler } from 'express';
import deleteFile from '../../util/file/deleteFile';
import { createDir } from '../../util/file/createDir';
import catchAsync from '../../util/server/catchAsync';
import sharp from 'sharp';

/**
 * Image upload middleware using multer.
 *
 * @param {Function} cb - A function to handle uploaded images.
 */
const imageUploader = (
  cb: (req: Request, images: string[]) => void,
  {
    isOptional = false,
    width,
    height,
  }: {
    isOptional?: boolean;
    width?: number;
    height?: number;
  } = {},
) => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'images');
  const resizedDir = path.join(uploadDir, 'resized');

  createDir(uploadDir);
  createDir(resizedDir);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
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
    upload(req, res, async err => {
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

      const resizedImages: string[] = [];
      for (const file of uploadedImages.images) {
        const filePath = path.join(uploadDir, file.filename);

        if (!width && !height) resizedImages.push(`/images/${file.filename}`);
        else {
          const resizedFilePath = path.join(resizedDir, file.filename);

          try {
            await sharp(filePath)
              .resize(width, height, { fit: 'inside' })
              .toFile(resizedFilePath);

            await deleteFile(`/images/${file.filename}`);

            resizedImages.push(`/images/resized/${file.filename}`);
          } catch (resizeError) {
            throw new ServerError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              'Image resizing failed',
            );
          }
        }
      }

      cb(req, resizedImages);
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
