const express = require('express');
const router = express.Router();
const userAccountEntity = require('../entities/userAccountEntity');

// === Controllers ===
class GetUserController {
  static async getAll(req, res) {
    try {
      const users = await userAccountEntity.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users', details: error });
    }
  }
}

class GetUserByIdController {
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const user = await userAccountEntity.getUserById(Number(id));
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: 'User not found', details: error });
    }
  }
}


class CreateUserController {
  static async create(req, res) {
    const { username, password, profile, suspended } = req.body;

    if (!username || !password || !profile) {
      return res.status(400).json({ error: 'Username, password, and profile are required' });
    }

    try {
      const newUser = await userAccountEntity.addUser(username, password, profile, suspended);
      res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add user', details: error });
    }
  }
}

class UpdateUserController {
  static async update(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const updatedUser = await userAccountEntity.updateUser(Number(id), updatedData);
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(404).json({ error: 'User not found or failed to update', details: error });
    }
  }
}

// === Routes ===

router.get('/users', GetUserController.getAll);
router.get('/users/:id', GetUserByIdController.getById);
router.post('/users', CreateUserController.create);
router.put('/users/:id', UpdateUserController.update);

module.exports = router;
