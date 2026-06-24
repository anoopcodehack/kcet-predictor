import { Router } from 'express';
import { predictorController } from '../controllers/predictorController.js';

const router = Router();

router.post('/predict', predictorController.predictAdmissions);

export default router;
