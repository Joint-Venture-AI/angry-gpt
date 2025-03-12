import config from '../../../config';
import { EUserRole, EUserStatus } from '../user/User.enum';
import { EUserGender } from '../user/User.enum';
import { TUser } from '../user/User.interface';

export const adminData: TUser = {
  name: { firstName: 'super', lastName: 'admin' },
  gender: EUserGender.MALE,
  email: config.admin.email,
  password: config.admin.password,
  role: EUserRole.ADMIN,
  avatar: '/placeholder.png',
  status: EUserStatus.ACTIVE,
};
