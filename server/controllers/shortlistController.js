const express = require('express');
const router = express.Router();
const shortlistEntity = require('../entities/shortlistEntity');

class ShortlistController {
  // Add a new shortlist
  static async addShortlist(req, res) {
    const { serviceID, hownerID } = req.body;

    if (!serviceID || !hownerID) {
      return res.status(400).json({ error: 'serviceID and hownerID are required' });
    }

    try {
      const result = await shortlistEntity.addShortlist(Number(serviceID), Number(hownerID));
      await shortlistEntity.updateShortlistCount(); // Update shortlist counts after adding
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add shortlist', details: error });
    }
  }

  // Remove a shortlist
  static async removeShortlist(req, res) {
    const { serviceID, hownerID } = req.body;

    if (!serviceID || !hownerID) {
      return res.status(400).json({ error: 'serviceID and hownerID are required' });
    }

    try {
      const result = await shortlistEntity.removeShortlist(Number(serviceID), Number(hownerID));
      await shortlistEntity.updateShortlistCount(); // Update shortlist counts after removing
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove shortlist', details: error });
    }
  }

  // Get all homeowners who shortlisted a service
  static async getHomeowners(req, res) {
    const { serviceID } = req.params;

    if (!serviceID) {
      return res.status(400).json({ error: 'serviceID is required' });
    }

    try {
      const result = await shortlistEntity.getHomeownersByService(Number(serviceID));
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch homeowners', details: error });
    }
  }
}

// Routes
router.post('/shortlists', ShortlistController.addShortlist);   // Add shortlist
router.delete('/shortlists', ShortlistController.removeShortlist); // Remove shortlist
router.get('/shortlists/:serviceID', ShortlistController.getHomeowners);

module.exports = router;
