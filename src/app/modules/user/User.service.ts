import { TUser } from './User.interface';
import User from './User.model';
import { userSearchableFields } from './User.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { StatusCodes } from 'http-status-codes';
import { Request } from 'express';
import deleteFile from '../../../shared/deleteFile';
import ServerError from '../../../errors/ServerError';

export const UserServices = {
  async create(user: Partial<TUser>) {
    await User.create(user);
  },

  async edit(req: Request) {
    const updateData = req.body as Partial<TUser>;

    const imagesToDelete = req?.user?.avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req?.user!._id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser)
      throw new ServerError(StatusCodes.NOT_FOUND, 'Admin not found');

    if (updateData?.avatar) await deleteFile(imagesToDelete!);

    return updatedUser;
  },

  async list(query: Record<string, unknown>) {
    const userQuery = new QueryBuilder(User.find(), query)
      .search(userSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    const total = await User.countDocuments();
    const users = await userQuery.modelQuery.exec();

    return {
      meta: {
        total,
      },
      users,
    };
  },
};
