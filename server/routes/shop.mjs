import {
    getAllShop,
    getPurchaseByID,
    getShopInventoryByID,
    purchaseEquipment,
} from '../api/db.mjs';
import { createRequire } from 'module';
import {shopEmailHandler} from "../api/email.mjs";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.get('/purchases/:id', getPurchaseByID);
router.get('/inventory/:id', getShopInventoryByID);
router.get('/', getAllShop);

router.post('/purchase', purchaseEquipment);
router.post('/email', shopEmailHandler);

export default router;