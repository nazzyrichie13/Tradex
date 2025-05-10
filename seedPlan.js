
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('./models/InvestmentPlan');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  await Plan.deleteMany();
  await Plan.insertMany([
    { title: 'Starter Plan', description: '7 days, 10% ROI', duration: 7, rate: 10 },
    { title: 'Silver Plan', description: '14 days, 25% ROI', duration: 14, rate: 25 },
    { title: 'Gold Plan', description: '30 days, 60% ROI', duration: 30, rate: 60 }
  ]);
  console.log('Plans seeded');
  process.exit();
};

seed();
