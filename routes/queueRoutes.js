const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Foydalanuvchi navbat oladi (har bir yangi kun va xizmat bo‘yicha 1 dan boshlanadi)
router.post('/', queueController.takeQueue);

// Admin barcha navbatlarni ko‘radi
router.get('/', queueController.getAllQueues);

// Admin navbat holatini o‘zgartiradi (approved/rejected)
router.put('/:id', queueController.updateQueueStatus);

// Foydalanuvchining barcha navbatlari
router.get('/user/:user_id', queueController.getUserQueues);

router.get('/user/all/:user_id/', queueController.getUserAllQueues);

module.exports = router;
