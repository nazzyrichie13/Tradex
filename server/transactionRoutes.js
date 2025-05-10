
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Transaction = require('../models/Transaction');

router.get('/', auth, async (req, res) => {
  const txns = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
  res.json(txns);
});

module.exports = router;
