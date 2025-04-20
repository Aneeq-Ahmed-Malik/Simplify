const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hardcoded JWT secret (consider moving to .env)
const JWT_SECRET = '8f9a7b3c2d5e4f1a9b8c7d6e3f2a1b9c8d7e6f5a4b3c2d1e9f8a7b6c5d4e3f';

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const payload = { userId: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Return token and user data
    res.status(201).json({
      token,
      user: {
        id: user.id.toString(), // Convert to string for frontend
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = { userId: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Return token and user data
    res.json({
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };