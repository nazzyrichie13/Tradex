
const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const auth = require('../middlewares/authMiddleware');

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  next();
};

router.get('/withdrawals', auth, isAdmin, async (req, res) => {
  const withdrawals = await Withdrawal.find().populate('user');
  res.json(withdrawals);
});

router.post('/withdrawals/:id/approve', auth, isAdmin, async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id);
  if (!withdrawal) return res.status(404).json({ msg: 'Not found' });

  withdrawal.status = 'approved';
  await withdrawal.save();
  res.json({ msg: 'Withdrawal approved' });
});

module.exports = router;
await sendMail(withdrawal.user.email, 'Withdrawal Approved', `
    <p>Your withdrawal of $${withdrawal.amount} has been approved.</p>
  `);
  
