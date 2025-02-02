import express from 'express';
import { getuserdata } from '../controllers/usercontroller.js';
import { userAuth } from '../middleware/userauth.js';

const router = express.Router();

router.get('/data', userAuth, getuserdata);

export default router;