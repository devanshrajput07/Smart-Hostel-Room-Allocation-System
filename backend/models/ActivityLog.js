const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            enum: ['ALLOCATE', 'DEALLOCATE', 'ROOM_CREATED', 'ROOM_DELETED', 'ROOM_RESET', 'FEE_CREATED', 'FEE_PAID'],
        },
        description: {
            type: String,
            required: true,
        },
        roomNo: {
            type: Number,
            default: null,
        },
        studentName: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
