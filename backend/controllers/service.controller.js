const Service = require('../models/schema/Service');

// Get all active and non-deleted services
exports.getAllActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true, isDeleted: false }).sort({ name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || service.isDeleted) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service', error: err.message });
  }
};

// Admin creates a new service
exports.createService = async (req, res) => {
  try {
    const { name, description, duration, category, icon_url, active } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Service name is required' });
    }

    const existing = await Service.findOne({ name: name.trim(), isDeleted: false });
    if (existing) {
      return res.status(409).json({ message: 'Service with this name already exists' });
    }

    const newService = new Service({
      name,
      description,
      duration,
      category,
      icon_url,
      active
    });

    await newService.save();
    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create service', error: err.message });
  }
};

// Admin updates service details
exports.updateService = async (req, res) => {
  try {
    const { name, description, duration, category, icon_url, active } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service || service.isDeleted) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (name) service.name = name;
    if (description !== undefined) service.description = description;
    if (duration !== undefined) service.duration = duration;
    if (category) service.category = category;
    if (icon_url !== undefined) service.icon_url = icon_url;
    if (active !== undefined) service.active = active;

    await service.save();
    res.json({ message: 'Service updated successfully', service });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service', error: err.message });
  }
};

// Admin deletes a service
exports.softDeleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || service.isDeleted) {
      return res.status(404).json({ message: 'Service not found or already deleted' });
    }

    service.isDeleted = true;
    await service.save();
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service', error: err.message });
  }
};
