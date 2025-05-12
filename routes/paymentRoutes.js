
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');  // Assuming you have a mailer utility

// Route to create a payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  const { amount } = req.body; // Amount should be in cents (e.g., $10 = 1000)

  if (amount <= 0) return res.status(400).json({ msg: 'Invalid amount' });

  try {
    // Create the payment intent with Stripe
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

// Route to handle successful payment and update user's wallet
router.post('/payment-success', auth, async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if the payment is successful
    if (paymentIntent.status === 'succeeded') {
      const user = await User.findById(req.user.id);
      const amount = paymentIntent.amount_received / 100;  // Convert to dollars

      // Update user's wallet
      user.wallet += amount;
      await user.save();

      // Optionally send an email notification to the user
      await sendMail(user.email, 'Payment Successful', `
        <p>Your payment of $${amount} has been successfully processed and added to your wallet.</p>
      `);

      // Respond with success
      res.json({ msg: 'Payment successful, wallet updated.' });
    } else {
      res.status(400).json({ msg: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
