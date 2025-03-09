import config from '../../../config';
import { TUser } from '../user/User.interface';

export const adminData: TUser = {
  name: { firstName: 'super', lastName: 'admin' },
  gender: 'male',
  email: config.admin.email,
  password: config.admin.password,
  role: 'ADMIN',
  avatar: '/placeholder.png',
};
