const express = require('express');
const router = express.Router();
const {
    createFee,
    getFees,
    markFeePaid,
    getFeeStats,
    deleteFee,
} = require('../controllers/feeController');

router.get('/stats', getFeeStats);
router.patch('/:id/pay', markFeePaid);
router.route('/').get(getFees).post(createFee);
router.route('/:id').delete(deleteFee);

module.exports = router;
