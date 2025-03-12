/* eslint-disable no-unused-vars */
import { Router } from 'express';
import { TRoute } from '../../../../types/route.types';

declare global {
  interface Function {
    inject(routes: TRoute[]): void;
  }
}

Function.prototype.inject = function (routes: TRoute[]) {
  routes.forEach(({ path, middlewares = [], route }) =>
    (this as Router).use(path, ...middlewares, route),
  );
};

export {};
