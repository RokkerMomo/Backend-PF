import {Router} from 'express'
import {signIn} from '../controllers/user.controller'
import { getGrade, getGrades } from '../controllers/grade.controller';

const router = Router();


router.post('/signin', signIn);
router.get('/grades', getGrades);
router.get('/grades/:id', getGrade);

export default router;