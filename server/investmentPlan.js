
const mongoose = require('mongoose');

const investmentPlanSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: Number, // in days
  rate: Number // return percentage
});

module.exports = mongoose.model('InvestmentPlan', investmentPlanSchema);
