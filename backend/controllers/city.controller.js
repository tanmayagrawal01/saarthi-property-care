const City = require('../models/schema/City');

// ➕ Create a new city
exports.createCity = async (req, res) => {
  try {
    const { name, state, pincode } = req.body;

    const existingCity = await City.findOne({
      name: name.toLowerCase(),
      state,
      pincode,
      isDeleted: false
    });

    if (existingCity) {
      return res.status(400).json({ message: 'City already exists' });
    }

    const city = new City({
      name,
      state,
      pincode,
      created_by: req.user?._id // from auth middleware
    });

    await city.save();

    res.status(201).json({ message: 'City created successfully', city });
  } catch (error) {
    res.status(500).json({ message: 'Error creating city', error: error.message });
  }
};

// ✏️ Update a city
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const city = await City.findOne({ _id: id, isDeleted: false });
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    Object.assign(city, updates);
    city.updated_by = req.user?._id;
    await city.save();

    res.json({ message: 'City updated successfully', city });
  } catch (error) {
    res.status(500).json({ message: 'Error updating city', error: error.message });
  }
};

// ❌ Soft delete a city
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findOne({ _id: id, isDeleted: false });
    if (!city) {
      return res.status(404).json({ message: 'City not found or already deleted' });
    }

    city.isDeleted = true;
    city.updated_by = req.user?._id;
    await city.save();

    res.json({ message: 'City deleted successfully (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting city', error: error.message });
  }
};

// 🌐 Get all active cities (with search and pagination)
exports.getAllCities = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const query = {
      isDeleted: false,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ]
    };

    const cities = await City.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await City.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      cities
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error: error.message });
  }
};
