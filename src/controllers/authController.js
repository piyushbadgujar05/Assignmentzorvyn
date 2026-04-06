const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const { email, password, role } = req.body;
      const user = await User.create({ email, password, role });
      res.status(201).json({ success: true, message: 'User registered' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Login user and return JWT
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, isDeleted: false });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (user.status === 'inactive') {
        return res.status(403).json({ success: false, message: 'Account is inactive' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );

      res.status(200).json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AuthController;
