import colors from 'colors';
import { createServer } from 'http';
import app from '../../app';
import config from '../../config';
import seedAdmin from '../../DB';
import { errorLogger, logger } from '../../shared/logger';
import shutdownServer from './shutdownServer';
import connectDB from './connectDB';

export default async function startServer() {
  try {
    const server = createServer(app);

    await connectDB();
    await seedAdmin();

    server.listen(config.server.port, config.server.ip_address, () => {
      logger.info(
        colors.yellow(
          `♻️ Server running on http://${config.server.ip_address}:${config.server.port}`,
        ),
      );
    });

    ['SIGTERM', 'SIGINT', 'unhandledRejection', 'uncaughtException'].forEach(
      signal =>
        process.on(signal, (err?: Error) =>
          shutdownServer(server, signal, err),
        ),
    );

    return server;
  } catch (error) {
    errorLogger.error(colors.red('❌ Server startup failed!'), error);
    process.exit(1);
  }
}
