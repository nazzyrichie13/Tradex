
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: 'Email already exists' });

    const user = await User.create({ name, email, password });

    // Send welcome email here
    await sendMail(user.email, 'Welcome to Tradex!', `
      <h2>Hi ${user.name}</h2>
      <p>Thank you for registering with Tradex. Start investing and earning today!</p>
    `);

    const token = createToken(user);
    res.json({ user: { name: user.name, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};








