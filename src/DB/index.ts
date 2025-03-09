import colors from 'colors';
import config from '../config';
import { logger } from '../shared/logger';
import User from '../app/modules/user/User.model';
import { TUser } from '../app/modules/user/User.interface';

const adminData: TUser = {
  name: { firstName: 'super', lastName: 'admin' },
  gender: 'male',
  role: 'ADMIN',
  email: config.admin.email as string,
  password: config.admin.password as string,
  avatar: 'https://i.ibb.co.com/Lk37HMB/download.jpg',
};

const seedAdmin = async () => {
  const hasAdmin = await User.exists({
    role: 'ADMIN',
  });

  if (hasAdmin) return;

  await User.create(adminData);
  logger.info(colors.green('✔admin created successfully!'));
};

export default seedAdmin;
