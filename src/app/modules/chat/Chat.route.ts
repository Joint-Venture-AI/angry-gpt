import { Router } from 'express';
import { ChatControllers } from './Chat.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { ChatValidations } from './Chat.validation';
import { MessageValidations } from '../message/Message.validation';
import { MessageControllers } from '../message/Message.controller';
import { QueryValidations } from '../query/Query.validation';

const router = Router();

router.get('/', purifyRequest(QueryValidations.list), ChatControllers.list);

router.post(
  '/create',
  purifyRequest(ChatValidations.create),
  ChatControllers.create,
);

router.patch(
  '/:chatId/rename',
  purifyRequest(ChatValidations.rename),
  ChatControllers.rename,
);

router.delete(
  '/:chatId/delete',
  purifyRequest(ChatValidations.delete),
  ChatControllers.delete,
);

router.delete('/clear', ChatControllers.clear);

router.get(
  '/:chatId',
  purifyRequest(QueryValidations.list, MessageValidations.list),
  MessageControllers.list,
);

router.post(
  '/:chatId',
  purifyRequest(MessageValidations.chat),
  MessageControllers.chat,
);

export const ChatRoutes = router;
