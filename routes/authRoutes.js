// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ro‘yxatdan o‘tish (faqat userlar uchun)
router.post('/register', authController.register);

// Login (admin va userlar uchun umumiy login)
router.post('/login', authController.login);

module.exports = router;
