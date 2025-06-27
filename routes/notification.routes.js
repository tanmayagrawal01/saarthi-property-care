const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const auth = require('../middlewares/auth.middleware');

// Create notification (admin only)
router.post('/', auth.authenticate, auth.verifyAdmin, NotificationController.createNotification);

// Get all notifications for logged-in user (user/caretaker/admin)
router.get('/my', auth.authenticate, NotificationController.getMyNotifications);

// Mark a specific notification as read
router.patch('/:id/read', auth.authenticate, NotificationController.markAsRead);

// Soft delete a notification (admin only)
router.delete('/:id', auth.authenticate, auth.verifyAdmin, NotificationController.softDeleteNotification);

// Mark all as read
router.patch('/read/all', auth.authenticate, NotificationController.markAllAsRead);

// Admin: Get all notifications (with filters)
router.get('/admin/all', auth.authenticate, auth.verifyAdmin, NotificationController.getAllNotifications);

// ✅ Match the export
router.delete('/:id', auth.verifyAdmin, NotificationController.softDeleteNotification);

module.exports = router;
