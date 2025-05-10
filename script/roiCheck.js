
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Investment = require('../models/Investment');
const Plan = require('../models/InvestmentPlan');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const checkMaturity = async () => {
  const investments = await Investment.find({ isMatured: false }).populate('plan');

  for (let invest of investments) {
    const { duration, rate } = invest.plan;
    const maturityDate = new Date(invest.startDate);
    maturityDate.setDate(maturityDate.getDate() + duration);

    if (new Date() >= maturityDate) {
      const maturedAmount = invest.amount + (invest.amount * rate) / 100;

      invest.isMatured = true;
      invest.status = 'completed';
      invest.maturedAmount = maturedAmount;

      await invest.save();
      console.log(`Investment ${invest._id} matured for $${maturedAmount}`);
    }
  }

  process.exit();
};

checkMaturity();
const User = require('../models/User');

// inside the maturity loop
const user = await User.findById(invest.user);
user.wallet += maturedAmount;
await user.save();
await sendMail(user.email, 'Investment Matured!', `
    <p>Your investment has matured and $${maturedAmount} has been credited to your wallet.</p>
  `);
  await Transaction.create({
    user: user._id,
    type: 'roi',
    amount: maturedAmount,
    reference: invest._id,
    description: `ROI matured for plan ${invest.plan.title}`
  });
  
  

