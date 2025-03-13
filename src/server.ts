import './util/prototype';
import startServer from './util/server/startServer';
import socket from './util/socket';

startServer().then(server => {
  server.use(socket);
});
