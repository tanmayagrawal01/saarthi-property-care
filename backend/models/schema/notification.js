const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },

  message: {
    type: String,
    required: true,
    maxlength: 1000
  },

  type: {
    type: String,
    enum: ['booking', 'cancellation', 'reminder', 'feedback', 'system', 'custom'],
    default: 'custom'
  },

  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipient_type'
  },

  recipient_type: {
    type: String,
    enum: ['User', 'Caretaker', 'Admin'],
    required: true
  },

  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  isRead: {
    type: Boolean,
    default: false
  },

  sent_at: {
    type: Date,
    default: Date.now
  },

  read_at: {
    type: Date
  },

  delivery_status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },

  device_token: {
    type: String // helpful for push notifications
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },

  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// async function testNotificationQuery() {
//   const notifications = await Notification.find({}).lean();
//   console.log(notifications);
// }
// testNotificationQuery();

NotificationSchema.index({ recipient_id: 1, recipient_type: 1, isRead: 1 });
NotificationSchema.index({ sent_at: -1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ isDeleted: 1 });
NotificationSchema.index({ type: 1 });

module.exports = mongoose.model('notification', NotificationSchema);