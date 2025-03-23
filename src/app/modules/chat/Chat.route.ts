import { Router } from 'express';
import { ChatControllers } from './Chat.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { ChatValidations } from './Chat.validation';

const router = Router();

router.post(
  '/create',
  purifyRequest(ChatValidations.create),
  ChatControllers.create,
);
router.patch('/:chatId/rename', ChatControllers.rename);
router.delete('/:chatId/delete', ChatControllers.delete);

export const ChatRoutes = router;
