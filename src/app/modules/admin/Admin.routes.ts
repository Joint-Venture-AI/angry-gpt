import { Router } from 'express';
import { SubscriptionRoutes } from '../subscription/Subscription.route';

const router = Router();

router.use('/subscription', SubscriptionRoutes.admin);

export const AdminRoutes = router;
