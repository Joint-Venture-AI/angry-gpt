import colors from 'colors';
import { errorLogger, logger } from '../shared/logger';
import User from '../app/modules/user/User.model';
import { adminData } from '../app/modules/auth/Auth.constant';

/**
 * Seeds the admin user if it doesn't exist in the database
 *
 * This function checks if an admin user already exists in the database.
 * If an admin user exists, it returns without creating a new one.
 * Otherwise, it creates a new admin user with the provided admin data.
 */
const seedAdmin = async () => {
  try {
    const hasAdmin = await User.exists({
      role: 'ADMIN',
    });

    if (hasAdmin) return;

    logger.info(colors.green('🔑 admin creation started...'));

    await User.create(adminData);

    logger.info(colors.green('✔ admin created successfully!'));
  } catch (error) {
    errorLogger.error(colors.red('❌ admin creation failed!'), error);
  }
};

export default seedAdmin;
