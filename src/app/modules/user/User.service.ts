import { TUser } from './User.interface';
import User from './User.model';
import { StatusCodes } from 'http-status-codes';
import { Request } from 'express';
import deleteFile from '../../../util/file/deleteFile';
import ServerError from '../../../errors/ServerError';

export const UserServices = {
  async create(userData: Partial<TUser>) {
    const user = await User.findOne({ email: userData.email });

    if (user)
      throw new ServerError(StatusCodes.CONFLICT, 'User already exists');

    return await User.create(userData);
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
    ).select('name avatar email role');

    if (!updatedUser)
      throw new ServerError(StatusCodes.NOT_FOUND, 'Admin not found');

    if (updateData?.avatar) await deleteFile(imagesToDelete!);

    return updatedUser;
  },

  async list(query: Record<string, unknown>) {
    const users = await User.find()
      .limit((query?.limit as number) ?? 10)
      .skip((query?.skip as number) ?? 10);

    const totalUsers = await User.countDocuments();

    return {
      meta: {
        total: totalUsers,
        page: query?.page as number,
        limit: query?.limit as number,
        totalPage: Math.ceil(totalUsers / (query?.limit as number)),
      },
      users,
    };
  },
};
