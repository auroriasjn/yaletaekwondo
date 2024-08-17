import { createRequire } from 'module';
import {approveEquipment, getAllAttendance, getAllDues, getAllShop, getUserFromNetID} from "../api/db.mjs";
import { updateUserAtNetID, removeUserByNetID, updateShopID, removeShopID, updateEquipID, removeEquipID, updateEvent } from "../api/db.mjs";
import { addShopItem, addUser, addEquipment, addTag, addEvent } from "../api/db.mjs"
import {approvalEmailHandler, equipEmailHandler} from "../api/email.mjs";

const require = createRequire(import.meta.url);

const express = require('express');
const multer = require('multer');
const upload = multer();

const router = express.Router();

router.get('/user/:netid', getUserFromNetID);
router.get('/attendance', getAllAttendance);
router.get('/dues', getAllDues);

router.get('/remove/:netid', upload.none(), removeUserByNetID);
router.get('/shop/remove/:shopid', upload.none(), removeShopID);
router.get('/equipment/remove/:equipid', upload.none(), removeEquipID);

router.post('/update/:netid', upload.none(), updateUserAtNetID);
router.post('/add', upload.none(), addUser);
router.post('/event', upload.none(), addEvent);
router.post('/event/update/:eventid', upload.none(), updateEvent);

router.post('/tag/add', upload.none(), addTag);

router.post('/shop/update/:shopid', upload.none(), updateShopID);
router.post('/shop/add/', upload.none(), addShopItem);

router.post('/equipment/update/:equipid', upload.none(), updateEquipID);
router.post('/equipment/add/', upload.none(), addEquipment);
router.post('/equipment/approve/', upload.none(), approveEquipment);
router.post('/equipment/approve/email/:netid', upload.none(), approvalEmailHandler);

export default router;