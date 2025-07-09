const Notification = require('../models/schema/notification');
const cron = require('node-cron');
const axios = require('axios'); // For optional push notification delivery

// 🔔 Admin: Create a notification
exports.createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type = 'custom',
      recipient_id,
      recipient_type,
      data = {},
      device_token
    } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      recipient_id,
      recipient_type,
      data,
      device_token,
      delivery_status: 'sent',
      created_by: req.user?._id
    });

    await notification.save();

    // Optional: Send push notification
    if (device_token) {
      try {
        await axios.post('https://your.push.service/send', {
          token: device_token,
          title,
          message,
          data
        });
      } catch (pushError) {
        notification.delivery_status = 'failed';
        await notification.save();
      }
    }

    res.status(201).json({ message: 'Notification created', notification });
  } catch (err) {
    res.status(500).json({ message: 'Error creating notification', error: err.message });
  }
};

// 📥 Get all notifications for logged-in user
exports.getMyNotifications = async (req, res) => {
  try {
    const recipient_type = req.user?.role === 'admin' ? 'Admin'
                          : req.user?.role === 'caretaker' ? 'Caretaker'
                          : 'User';

    const notifications = await Notification.find({
      recipient_id: req.user._id,
      recipient_type,
      isDeleted: false
    }).sort({ sent_at: -1 });

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

// ✅ Mark one notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient_id: req.user._id,
      isDeleted: false
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    notification.read_at = new Date();
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
};

// 🧹 Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    const recipient_type = req.user?.role === 'admin' ? 'Admin'
                          : req.user?.role === 'caretaker' ? 'Caretaker'
                          : 'User';

    const result = await Notification.updateMany(
      {
        recipient_id: req.user._id,
        recipient_type,
        isRead: false,
        isDeleted: false
      },
      {
        $set: {
          isRead: true,
          read_at: new Date()
        }
      }
    );

    res.json({ message: 'All notifications marked as read', modified: result.nModified });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications', error: err.message });
  }
};

// ❌ Admin: Soft delete a notification
exports.softDeleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isDeleted = true;
    notification.updated_by = req.user?._id;
    await notification.save();

    res.json({ message: 'Notification soft-deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
};

// 🔍 Admin: Get all notifications (with filters)
exports.getAllNotifications = async (req, res) => {
  try {
    const { type, recipient_type, isRead, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };
    if (type) query.type = type;
    if (recipient_type) query.recipient_type = recipient_type;
    if (isRead === 'true' || isRead === 'false') query.isRead = isRead === 'true';

    const notifications = await Notification.find(query)
      .sort({ sent_at: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      notifications
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

// 📆 CRON: Schedule reminder notifications (example: every day at 9 AM)
cron.schedule('0 9 * * *', async () => {
  try {
    const upcomingBookings = await getUpcomingBookingsWithin24Hours();

    for (const booking of upcomingBookings) {
      const existing = await Notification.findOne({
        recipient_id: booking.owner_id,
        type: 'reminder',
        isDeleted: false,
        title: { $regex: booking.slug }
      });

      if (!existing) {
        await Notification.create({
          title: `Reminder for Booking - ${booking.slug}`,
          message: `Your caretaker will visit ${booking.property_id} tomorrow.`,
          type: 'reminder',
          recipient_id: booking.owner_id,
          recipient_type: 'User',
          data: { booking_id: booking._id },
          delivery_status: 'sent'
        });
      }
    }
  } catch (err) {
    console.error('Scheduled Notification Error:', err.message);
  }
});

// Dummy function (you can implement based on Booking model)
async function getUpcomingBookingsWithin24Hours() {
  const Booking = require('../models/schema/Booking');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return Booking.find({
    date: { $gte: new Date(), $lt: tomorrow },
    isDeleted: false
  }).populate('property_id');
}
