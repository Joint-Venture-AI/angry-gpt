import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { BotControllers } from './Bot.controller';
import { BotValidations } from './Bot.validation';
import imageUploader from '../../middlewares/imageUploader';
import { QueryValidations } from '../query/Query.validation';

const router = Router();

router.post(
  '/create-bot',
  imageUploader((req, images) => (req.body.logo = images[0]), {
    width: 300,
    height: 300,
  }),
  purifyRequest(BotValidations.createBot),
  BotControllers.create,
);

router.post(
  '/create-url',
  imageUploader((req, images) => (req.body.logo = images[0]), {
    width: 300,
    height: 300,
  }),
  purifyRequest(BotValidations.createUrl),
  BotControllers.create,
);

router.patch(
  '/:botId/edit',
  purifyRequest(BotValidations.exists),
  imageUploader((req, images) => (req.body.logo = images[0]), {
    width: 300,
    height: 300,
    isOptional: true,
  }),
  purifyRequest(BotValidations.edit),
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
    purifyRequest(QueryValidations.list),
    BotControllers.list,
  ),
};
