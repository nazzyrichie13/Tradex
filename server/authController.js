
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
    const token = createToken(user);
    res.json({ user: { name: user.name, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = createToken(user);
    res.json({ user: { name: user.name, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const { sendMail } = require('../utils/mailer');

await sendMail(user.email, 'Welcome to Tradex!', `
  <h2>Hi ${user.name}</h2>
  <p>Thank you for registering with Tradex. Start investing and earning today!</p>
`);

