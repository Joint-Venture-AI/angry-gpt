import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { BotControllers } from './Bot.controller';
import { BotValidations } from './Bot.validation';

const router = Router();

router.post(
  '/create-bot',
  purifyRequest(BotValidations.createBot),
  BotControllers.create,
);

router.post(
  '/create-url',
  purifyRequest(BotValidations.createUrl),
  BotControllers.create,
);

router.patch(
  '/:botId/update',
  purifyRequest(BotValidations.exists, BotValidations.edit),
  BotControllers.update,
);

router.delete(
  '/:botId/delete',
  purifyRequest(BotValidations.exists),
  BotControllers.delete,
);

export const BotRoutes = {
  admin: router,
  user: Router().get(
    '/',
    purifyRequest(BotValidations.list),
    BotControllers.list,
  ),
};
