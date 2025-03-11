import { Router } from 'express';
import { TransactionControllers } from './Transaction.controller';

const router = Router();

router.get('/', TransactionControllers.retrieve);

export const TransactionRoutes = router;
