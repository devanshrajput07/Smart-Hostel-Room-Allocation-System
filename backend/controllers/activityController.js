const ActivityLog = require('../models/ActivityLog');

// @desc    Get recent activity logs
// @route   GET /api/activity
const getActivityLogs = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const logs = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        next(error);
    }
};

module.exports = { getActivityLogs };
