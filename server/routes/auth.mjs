import { casLogin, casLogout, passportConfig, authHandler } from '../api/auth.mjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.get('/login', casLogin);
router.get('/check-auth', authHandler);
router.post('/logout', casLogout);

export default router;