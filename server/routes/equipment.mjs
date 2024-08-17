import {checkinEquipment, getAllEquipment, getEquipmentByID, reserveEquipment, returnEquipment} from '../api/db.mjs';
import { createRequire } from 'module';
import {equipEmailHandler, checkoutEmailHandler} from "../api/email.mjs";
const require = createRequire(import.meta.url);

const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentByID);

router.post('/reserve', reserveEquipment);
router.post('/checkin', upload.none(), checkinEquipment);
router.post('/return', upload.none(), returnEquipment);

router.post('/email', equipEmailHandler);
router.post('/checkin/email', upload.none(), checkoutEmailHandler);

export default router;