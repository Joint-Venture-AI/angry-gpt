import { Router } from 'express';
import { SubscriptionRoutes } from '../subscription/Subscription.route';
import auth from '../../middlewares/auth';

const router = Router();

//! Admin routes are protected
router.use(auth('ADMIN'));

router.use('/subscription', SubscriptionRoutes.admin);

export const AdminRoutes = router;
