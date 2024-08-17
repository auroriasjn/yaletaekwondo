import {
    getCurUser,
    getCurAttendance,
    getCurUserEquipment,
    getCurDues,
    getAllTags,
    getAllBelts,
    getAllEvents,
    getMemberDirectory,
    updateCurUser
} from '../api/db.mjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.get('/', getCurUser);
router.get('/attendance', getCurAttendance);
router.get('/equipment', getCurUserEquipment);
router.get('/dues', getCurDues);

router.get('/belts', getAllBelts);
router.get('/tags', getAllTags);
router.get('/events', getAllEvents);

router.get('/directory', getMemberDirectory);

router.post('/update', upload.none(), updateCurUser);

export default router;