import { FRONTEND_URL, SECRET_KEY } from './config.mjs'
import { createRequire } from 'module';
import { passportConfig } from './api/auth.mjs';

import authRoutes from './routes/auth.mjs';
import userRoutes from './routes/users.mjs';
import shopRoutes from './routes/shop.mjs';
import adminRoutes from './routes/admin.mjs';
import equipmentRoutes from './routes/equipment.mjs';

const require = createRequire(import.meta.url);
const express = require('express');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');

const app = express();

// PRIMARY INITIALIZATION
app.get('/', () => {
    console.log("Accessed server root!\n");
});

app.use(cors({
    origin: FRONTEND_URL, // Replace with your frontend URL
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(cookieParser(SECRET_KEY));
app.use(express.json());

app.use(expressSession({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: true,

    cookie: {
        // Cookie lifetime of one year.
        maxAge: 365 * 24 * 60 * 60 * 1000,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

// CONTROLLERS
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/equipment', equipmentRoutes);

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});