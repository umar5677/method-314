const express = require('express');
const router = express.Router();
const userAccountEntity = require('../entities/userAccountEntity');

class LoginController {
  static async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const user = await userAccountEntity.loginUser(username, password);
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(401).json({ error: 'Login failed', details: error });
    }
  }
}

router.post('/login', LoginController.login);

module.exports = router;