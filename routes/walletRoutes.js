
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ wallet: user.wallet });
});

module.exports = router;
