// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Barcha xizmatlarni olish
router.get('/', serviceController.getAllServices);

// Xizmat qo‘shish
router.post('/', serviceController.addService);

// Xizmatni o‘chirish
router.delete('/:id', serviceController.deleteService);

// Xizmatni tahrirlash
router.put('/:id', serviceController.updateService);

module.exports = router;
