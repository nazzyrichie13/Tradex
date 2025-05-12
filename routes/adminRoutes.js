const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');
const { sendMail } = require('../utils/mailer'); // make sure this is correct

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  next();
};

router.get('/withdrawals', auth, isAdmin, async (req, res) => {
  const withdrawals = await Withdrawal.find().populate('user');
  res.json(withdrawals);
});

router.post('/withdrawals/:id/approve', auth, isAdmin, async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id).populate('user');
  if (!withdrawal) return res.status(404).json({ msg: 'Not found' });

  withdrawal.status = 'approved';
  await withdrawal.save();

  // Send email to user
  await sendMail(withdrawal.user.email, 'Withdrawal Approved', `
    <p>Your withdrawal of $${withdrawal.amount} has been approved.</p>
  `);

  // Notify user via socket (optional)
  const userSocketId = users.get(withdrawal.user._id.toString());
  if (userSocketId) {
    io.to(userSocketId).emit('withdrawal_approved', {
      message: 'Your withdrawal has been approved.',
      withdrawalId: withdrawal._id
    });
  }

  res.json({ msg: 'Withdrawal approved' });
});

// New Reject Route
router.post('/withdrawals/:id/reject', auth, isAdmin, async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id).populate('user');
  if (!withdrawal) return res.status(404).json({ msg: 'Not found' });

  withdrawal.status = 'rejected';
  await withdrawal.save();

  // Send email to user
  await sendMail(withdrawal.user.email, 'Withdrawal Rejected', `
    <p>Your withdrawal of $${withdrawal.amount} has been rejected. Please contact support for more details.</p>
  `);

  // Notify user via socket (optional)
  const userSocketId = users.get(withdrawal.user._id.toString());
  if (userSocketId) {
    io.to(userSocketId).emit('withdrawal_rejected', {
      message: 'Your withdrawal has been rejected.',
      withdrawalId: withdrawal._id
    });
  }

  res.json({ msg: 'Withdrawal rejected' });
});

module.exports = router;
