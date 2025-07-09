const Property = require('../models/schema/Property');

// ➕ Create a new property
exports.createProperty = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;

    const newProperty = new Property({
      ...data,
      user_id: user._id
    });

    await newProperty.save();
    res.status(201).json({ message: 'Property created successfully', property: newProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error creating property', error: error.message });
  }
};

// 🔄 Update a property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const property = await Property.findOne({ _id: id, user_id: user._id, isDeleted: false });
    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    Object.assign(property, req.body);
    await property.save();

    res.json({ message: 'Property updated', property });
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
};

// ❌ Soft delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const property = await Property.findOne({ _id: id, user_id: user._id, isDeleted: false });
    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    property.isDeleted = true;
    await property.save();

    res.json({ message: 'Property deleted (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
};

// 🔍 Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findOne({ _id: id, isDeleted: false })
      .populate('city_id')
      .populate('user_id', '-password_hash'); // Exclude password hash

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
};

// 📄 Get properties by current user
exports.getPropertiesByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const properties = await Property.find({ user_id: userId, isDeleted: false });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};

// 🌆 Get properties by city
exports.getPropertiesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const properties = await Property.find({ city_id: cityId, isDeleted: false });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};

// 📊 Get all properties (admin)
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isDeleted: false })
      .populate('city_id')
      .populate('user_id', '-password_hash');

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all properties', error: error.message });
  }
};
