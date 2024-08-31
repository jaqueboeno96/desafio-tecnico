import { Router } from 'express';
import { uploadMeasure, confirmMeasure, listMeasures } from '../controllers/measureController';

const router = Router();


router.post('api/upload', uploadMeasure);
router.patch('api/confirm', confirmMeasure);
router.get('api/:customer_code/list', listMeasures);


export default router;