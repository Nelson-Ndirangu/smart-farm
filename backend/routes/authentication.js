const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('./models/Farmer');
const Agronomist = require('./models/Agronomist');
const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { role, firstName, lastName, email, phone, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    if (role === 'farmer') {
      const existing = await Farmer.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered' });

      const farmer = await Farmer.create({ firstName, lastName, email, phone, passwordHash });
      const token = jwt.sign({ userId: farmer._id, role: 'farmer' }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: farmer, role: 'farmer' });

    } else if (role === 'agronomist') {
      const existing = await Agronomist.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered' });

      const agronomist = await Agronomist.create({ 

             firstName, lastName, email, phone, passwordHash
     });

      const token = jwt.sign({ userId: agronomist._id, role: 'agronomist' },
         process.env.JWT_SECRET, { expiresIn: '7d' } );
         
      return res.json({ token, user: agronomist, role: 'agronomist' });

    } else {
      return res.status(400).json({ message: 'Invalid role type' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { role, email, password } = req.body;

    let user;
    if (role === 'farmer') {
      user = await Farmer.findOne({ email });
    } else if (role === 'agronomist') {
      user = await Agronomist.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role type' });
    }

    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
