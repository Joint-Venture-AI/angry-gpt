import './util/prototype';
import useSocket from './helpers/useSocket';
import startServer from './util/server/startServer';

startServer().then(server => {
  useSocket(server);
});
