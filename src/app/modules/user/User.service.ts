import { TUser } from './User.interface';
import User from './User.model';
import { userSearchableFields } from './User.constant';
import QueryBuilder from '../../builder/QueryBuilder';

export const UserServices = {
  async create(user: Partial<TUser>) {
    await User.create(user);
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
