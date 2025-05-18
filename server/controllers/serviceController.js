const express = require('express');
const router = express.Router();
const serviceEntity = require('../entities/serviceEntity');

// === Controllers ===

// Get All Services
class GetAllServicesController {
  static async getAll(req, res) {
    try {
      const services = await serviceEntity.getAllServices();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services', details: error });
    }
  }
}

// Get Service by ID
class GetServiceByIdController {
  static async getById(req, res) {
    const { serviceID } = req.params;
    try {
      const service = await serviceEntity.getServiceById(Number(serviceID));
      res.status(200).json(service);
    } catch (error) {
      res.status(404).json({ error: 'Service not found', details: error });
    }
  }
}

// Get Services by Cleaner ID
class GetServicesByCleanerController {
  static async getByCleaner(req, res) {
    const { cleanerID } = req.params;
    try {
      const services = await serviceEntity.getServicesByCleanerId(Number(cleanerID));
      res.status(200).json(services);
    } catch (error) {
      res.status(404).json({ error: 'Services not found for this cleaner', details: error });
    }
  }
}

// Add a New Service
class CreateServiceController {
  static async create(req, res) {
    const { category, cleanerID, price } = req.body;

    if (!category || !cleanerID || !price) {
      return res.status(400).json({ error: 'Category, cleanerID, and price are required' });
    }

    try {
      const newService = await serviceEntity.addService(category, cleanerID, price);
      res.status(201).json({ message: 'Service added successfully', service: newService });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add service', details: error });
    }
  }
}

// Update a Service
class UpdateServiceController {
  static async update(req, res) {
    const { serviceID } = req.params;
    const updatedData = req.body;

    try {
      const updatedService = await serviceEntity.updateService(Number(serviceID), updatedData);
      res.status(200).json({ message: 'Service updated successfully', service: updatedService });
    } catch (error) {
      res.status(404).json({ error: 'Service not found or failed to update', details: error });
    }
  }
}

// Delete a Service
class DeleteServiceController {
  static async delete(req, res) {
    const { serviceID } = req.params;
    try {
      await serviceEntity.deleteService(Number(serviceID));
      res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(404).json({ error: 'Service not found or failed to delete', details: error });
    }
  }
}

// Get Services by hownerID
class GetServicesByHownerController {
  static async getByHowner(req, res) {
    const { hownerID } = req.params;
    try {
      const services = await serviceEntity.getServicesByHownerId(Number(hownerID));
      res.status(200).json(services);
    } catch (error) {
      res.status(404).json({ error: 'Services not found for this homeowner', details: error });
    }
  }
}


// === Routes ===
router.get('/services', GetAllServicesController.getAll); // Get all services
router.get('/services/:serviceID', GetServiceByIdController.getById); // Get service by ID
router.get('/services/cleaner/:cleanerID', GetServicesByCleanerController.getByCleaner); // Get services by cleaner ID
router.post('/services', CreateServiceController.create); // Add new service
router.put('/services/:serviceID', UpdateServiceController.update); // Update service
router.delete('/services/:serviceID', DeleteServiceController.delete); // Delete service
router.get('/services/howner/:hownerID', GetServicesByHownerController.getByHowner); // Get services by hownerID

module.exports = router;
