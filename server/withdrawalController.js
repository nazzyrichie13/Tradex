
 const Withdrawal = require('../models/Withdrawal');

// exports.requestWithdrawal = async (req, res) => {
//   const { amount } = req.body;
//   if (amount <= 0) return res.status(400).json({ msg: 'Invalid amount' });

//   const withdrawal = await Withdrawal.create({
//     user: req.user.id,
//     amount
//   });

//   res.json({ msg: 'Withdrawal requested', withdrawal });
// };

// exports.getUserWithdrawals = async (req, res) => {
//   const withdrawals = await Withdrawal.find({ user: req.user.id });
//   res.json(withdrawals);
// };
exports.requestWithdrawal = async (req, res) => {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ msg: 'Invalid amount' });
  
    const user = await User.findById(req.user.id);
    if (amount > user.wallet) return res.status(400).json({ msg: 'Insufficient wallet balance' });
  
    const withdrawal = await Withdrawal.create({
      user: req.user.id,
      amount
    });
  
    user.wallet -= amount;
    await user.save();
  
    res.json({ msg: 'Withdrawal requested', withdrawal });
  };
  await sendMail(user.email, 'Withdrawal Requested', `
    <p>Your withdrawal request of $${amount} has been received and is under review.</p>
  `);
  await Transaction.create({
    user: req.user.id,
    type: 'withdrawal',
    amount,
    reference: withdrawal._id,
    description: `Withdrawal requested`
  });
  // Assuming you update withdrawal status like this:
withdrawal.status = 'rejected';
await withdrawal.save();

// Then notify user via socket
const userSocketId = users.get(withdrawal.user.toString());
if (userSocketId) {
  io.to(userSocketId).emit('withdrawal_rejected', {
    message: 'Your withdrawal was rejected. Please contact support.',
    withdrawalId: withdrawal._id
  });
}

  
  