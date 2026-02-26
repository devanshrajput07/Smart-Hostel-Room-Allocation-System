const Fee = require('../models/Fee');
const Student = require('../models/Student');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create a fee entry
// @route   POST /api/fees
const createFee = async (req, res, next) => {
    try {
        const { studentId, amount, description, dueDate } = req.body;

        if (!studentId || !amount || !dueDate) {
            res.status(400);
            throw new Error('Student, amount, and due date are required');
        }

        const student = await Student.findById(studentId);
        if (!student) {
            res.status(404);
            throw new Error('Student not found');
        }

        const fee = await Fee.create({
            student: studentId,
            amount,
            description: description || 'Hostel Fee',
            dueDate,
            status: new Date(dueDate) < new Date() ? 'Overdue' : 'Pending',
        });

        await ActivityLog.create({
            action: 'FEE_CREATED',
            description: `Fee of ₹${amount} created for ${student.name} (${student.rollNo})`,
            studentName: student.name,
        });

        const populated = await Fee.findById(fee._id).populate('student');
        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all fees
// @route   GET /api/fees
const getFees = async (req, res, next) => {
    try {
        const { status, studentId } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (studentId) filter.student = studentId;

        // Auto-update overdue
        await Fee.updateMany(
            { status: 'Pending', dueDate: { $lt: new Date() } },
            { status: 'Overdue' }
        );

        const fees = await Fee.find(filter)
            .populate('student')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: fees.length, data: fees });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark fee as paid
// @route   PATCH /api/fees/:id/pay
const markFeePaid = async (req, res, next) => {
    try {
        const fee = await Fee.findById(req.params.id).populate('student');
        if (!fee) {
            res.status(404);
            throw new Error('Fee record not found');
        }

        if (fee.status === 'Paid') {
            res.status(400);
            throw new Error('Fee is already paid');
        }

        fee.status = 'Paid';
        fee.paidDate = new Date();
        await fee.save();

        await ActivityLog.create({
            action: 'FEE_PAID',
            description: `₹${fee.amount} paid by ${fee.student.name} (${fee.student.rollNo})`,
            studentName: fee.student.name,
        });

        res.status(200).json({ success: true, data: fee });
    } catch (error) {
        next(error);
    }
};

// @desc    Get fee stats
// @route   GET /api/fees/stats
const getFeeStats = async (req, res, next) => {
    try {
        await Fee.updateMany(
            { status: 'Pending', dueDate: { $lt: new Date() } },
            { status: 'Overdue' }
        );

        const fees = await Fee.find();
        const stats = {
            total: fees.length,
            totalAmount: fees.reduce((s, f) => s + f.amount, 0),
            paid: fees.filter((f) => f.status === 'Paid').length,
            paidAmount: fees.filter((f) => f.status === 'Paid').reduce((s, f) => s + f.amount, 0),
            pending: fees.filter((f) => f.status === 'Pending').length,
            pendingAmount: fees.filter((f) => f.status === 'Pending').reduce((s, f) => s + f.amount, 0),
            overdue: fees.filter((f) => f.status === 'Overdue').length,
            overdueAmount: fees.filter((f) => f.status === 'Overdue').reduce((s, f) => s + f.amount, 0),
        };

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a fee
// @route   DELETE /api/fees/:id
const deleteFee = async (req, res, next) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);
        if (!fee) {
            res.status(404);
            throw new Error('Fee not found');
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { createFee, getFees, markFeePaid, getFeeStats, deleteFee };
