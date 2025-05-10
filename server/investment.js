
const mongoose = require('mongoose');

// const investmentSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   plan: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPlan' },
//   amount: Number,
//   startDate: { type: Date, default: Date.now },
//   status: { type: String, default: 'active' }
  
// });
const investmentSchema = new mongoose.Schema({
    
    isMatured: { type: Boolean, default: false },
    maturedAmount: { type: Number, default: 0 }
  });
  

module.exports = mongoose.model('Investment', investmentSchema);
