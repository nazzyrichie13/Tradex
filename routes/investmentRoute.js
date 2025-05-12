
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getPlans, invest, getUserInvestments } = require('../controllers/investmentController');

router.get('/plans', auth, getPlans);
router.post('/invest', auth, invest);
router.get('/my-investments', auth, getUserInvestments);

module.exports = router;
