import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';

const router = Router();

router.get('/trends', analyticsController.getCutoffTrends);
router.get('/dashboard-stats', analyticsController.getDashboardStats);
router.post('/import-csv', analyticsController.importCSV);

export default router;
