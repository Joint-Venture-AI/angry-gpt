import { Router } from 'express';
import { UserControllers } from './User.controller';

const router = Router();

router.get('/', UserControllers.list);

export const UserRoutes = router;
