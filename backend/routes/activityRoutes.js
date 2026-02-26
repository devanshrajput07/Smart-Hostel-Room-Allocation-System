const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');

router.get('/', getActivityLogs);

module.exports = router;
