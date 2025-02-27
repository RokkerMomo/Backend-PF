"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
exports.default = {
    jwtSecret: process.env.JWT_SECRET || 'somesecret',
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost/BackendPF',
        USER: process.env.MONGODB_USER || '',
        PASSWORD: process.env.MONGODB_PASSWORD || ''
    }
};
