import { Router } from 'express';
import { collegeController } from '../controllers/collegeController.js';

const router = Router();

router.get('/colleges', collegeController.getColleges);
router.get('/colleges/:code', collegeController.getCollegeByCode);
router.get('/branches', collegeController.getBranches);
router.get('/categories', collegeController.getCategories);
router.post('/colleges', collegeController.addCollege);

export default router;
