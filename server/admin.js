const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// PATCH /api/admin/update-matured/:userId
router.patch('/update-matured/:userId', verifyToken, verifyAdmin, async (req, res) => {
  const { maturedAmount } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { maturedAmount },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Matured amount updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating matured amount', error: err });
  }
});

module.exports = router;
