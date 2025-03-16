import config from '../../../config';
import { EUserRole, EUserStatus } from '../user/User.enum';
import { TUser } from '../user/User.interface';

const { name, email, password } = config.admin;

export const adminData: TUser = {
  name,
  email,
  password,
  role: EUserRole.ADMIN,
  avatar: config.server.default_avatar,
  status: EUserStatus.ACTIVE,
};
