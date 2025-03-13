/* eslint-disable no-unused-vars */
import { Server } from 'http';

declare module 'http' {
  interface Server {
    use: (fn: (server: Server) => void) => this;
  }
}

Server.prototype.use = function (fn) {
  fn(this);

  return this;
};
