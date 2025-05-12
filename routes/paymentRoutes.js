
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.post('/create-payment-intent', auth, async (req, res) => {
  const { amount } = req.body; // Amount should be in cents (e.g., $10 = 1000)

  if (amount <= 0) return res.status(400).json({ msg: 'Invalid amount' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { userId: req.user.id }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { userId: req.user.id }
  });
  
  const user = await User.findById(req.user.id);
  user.wallet += amount / 100; // Convert cents to dollars
  await user.save();
  
