const mongoose = require('mongoose');
const sampleUsers = [
  {
    name: 'Niharika Agrawal',
    email: 'niharika@example.com',
    phone: '9876543210',
    password_hash: 'niharika123', // plain text hash (NOT RECOMMENDED in production)
    user_type: 'property_owner',
    profile_photo_url: 'https://example.com/photos/niharika.jpg',
    email_verified: true,
    address: 'Tech Street, Mathura',
    city_id: new mongoose.Types.ObjectId(),
    device_token: 'device_token_123',
    slug: 'niharika-agrawal-1234'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9988776655',
    password_hash: 'priya123',
    user_type: 'caretaker',
    profile_photo_url: 'https://example.com/photos/priya.jpg',
    email_verified: false,
    address: 'Cleaning Lane, Delhi',
    city_id: new mongoose.Types.ObjectId(),
    device_token: 'device_token_456',
    slug: 'priya-sharma-1234'
  }
];

module.exports = { data: sampleUsers }; 