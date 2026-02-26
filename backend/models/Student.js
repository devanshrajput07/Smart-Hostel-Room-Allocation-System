const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Student name is required'],
            trim: true,
        },
        rollNo: {
            type: String,
            required: [true, 'Roll number is required'],
            unique: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: '',
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            default: null,
        },
        allocatedAt: {
            type: Date,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
