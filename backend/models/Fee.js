const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student reference is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Fee amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        description: {
            type: String,
            default: 'Hostel Fee',
            trim: true,
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
        paidDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Overdue'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);
