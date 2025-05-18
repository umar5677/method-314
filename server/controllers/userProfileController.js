const express = require('express');
const router = express.Router();
const userProfileEntity = require('../entities/userProfileEntity'); // Import the user profile entity

// === Controllers ===

class GetUserProfilesController {
  static async getAll(req, res) {
    try {
      const profiles = await userProfileEntity.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profiles', details: error });
    }
  }
}

class CreateUserProfileController {
  static async create(req, res) {
    const { profile, suspended } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    try {
      const newProfile = await userProfileEntity.addProfile(profile, suspended);
      res.status(201).json({ message: 'Profile added successfully', profile: newProfile });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add profile', details: error });
    }
  }
}

class UpdateUserProfileController {
  static async update(req, res) {
    const { profileID } = req.params; // profileID instead of profile name
    const updatedData = req.body;

    try {
      const updatedProfile = await userProfileEntity.updateProfileByID(profileID, updatedData);
      res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
      res.status(404).json({ error: 'Profile not found or failed to update', details: error });
    }
  }
}

// === Routes ===
router.get('/profiles', GetUserProfilesController.getAll);
router.post('/profiles', CreateUserProfileController.create);
router.put('/profiles/:profileID', UpdateUserProfileController.update);

module.exports = router;
