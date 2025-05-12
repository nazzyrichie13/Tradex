
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { requestWithdrawal, getUserWithdrawals } = require('../controllers/withdrawalController');

router.post('/', auth, requestWithdrawal);
router.get('/', auth, getUserWithdrawals);

module.exports = router;
