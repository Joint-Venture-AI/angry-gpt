import colors from 'colors';
import { Server } from 'http';
import { errorLogger, logger } from '../../shared/logger';

export default function shutdownServer(
  server: Server,
  signal: string,
  err?: Error,
) {
  if (err) errorLogger.error(colors.red(`${signal} occurred: `), err);

  logger.info(colors.magenta(`🔴 Shutting down server due to ${signal}...`));

  server.close(shutdownErr => {
    if (shutdownErr) {
      errorLogger.error(
        colors.red('❌ Error during server shutdown'),
        shutdownErr,
      );
      process.exit(1);
    }

    logger.info(colors.magenta('✅ Server closed.'));
    process.exit(0);
  });
}
