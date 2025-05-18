const express = require('express');
const router = express.Router();
const viewEntity = require('../entities/viewEntity');

class ViewController {
  static async addView(req, res) {
    const { serviceID, accountID } = req.body;

    if (!serviceID || !accountID) {
      return res.status(400).json({ error: 'serviceID and accountID are required' });
    }

    try {
      const result = await viewEntity.addView(Number(serviceID), Number(accountID));
      await viewEntity.updateViewCount(); // Update view count after adding view
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add view or update count', details: error });
    }
  }
}

// Route included here
router.post('/views', ViewController.addView);

module.exports = router;
