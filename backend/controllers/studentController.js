const Student = require('../models/Student');
const Room = require('../models/Room');
const ActivityLog = require('../models/ActivityLog');
const { findBestRoom } = require('../utils/allocator');

// @desc    Allocate student to best-fit room
// @route   POST /api/students/allocate
const allocateStudent = async (req, res, next) => {
    try {
        const { name, rollNo, phone, email, needsAC, needsWashroom } = req.body;

        if (!name || !rollNo) {
            res.status(400);
            throw new Error('Student name and roll number are required');
        }

        // Check if student already exists and is active
        const existing = await Student.findOne({ rollNo, isActive: true });
        if (existing && existing.room) {
            res.status(400);
            throw new Error(`Student ${rollNo} is already allocated to a room`);
        }

        const rooms = await Room.find();
        const bestRoom = findBestRoom(rooms, 1, needsAC || false, needsWashroom || false);

        if (!bestRoom) {
            return res.status(200).json({
                success: true,
                allocated: false,
                message: 'No room available matching the given requirements',
                data: null,
            });
        }

        // Create or update student
        let student;
        if (existing) {
            existing.name = name;
            existing.phone = phone || '';
            existing.email = email || '';
            existing.room = bestRoom._id;
            existing.allocatedAt = new Date();
            student = await existing.save();
        } else {
            student = await Student.create({
                name,
                rollNo,
                phone: phone || '',
                email: email || '',
                room: bestRoom._id,
                allocatedAt: new Date(),
            });
        }

        // Update room occupants
        bestRoom.occupants += 1;
        await bestRoom.save();

        // Log activity
        await ActivityLog.create({
            action: 'ALLOCATE',
            description: `${name} (${rollNo}) allocated to Room ${bestRoom.roomNo}`,
            roomNo: bestRoom.roomNo,
            studentName: name,
        });

        const populated = await Student.findById(student._id).populate('room');

        res.status(200).json({
            success: true,
            allocated: true,
            message: `${name} allocated to Room ${bestRoom.roomNo}`,
            data: populated,
            room: bestRoom,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deallocate student from room
// @route   POST /api/students/:id/deallocate
const deallocateStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).populate('room');

        if (!student) {
            res.status(404);
            throw new Error('Student not found');
        }

        if (!student.room) {
            res.status(400);
            throw new Error('Student is not allocated to any room');
        }

        const room = await Room.findById(student.room._id);
        const roomNo = room.roomNo;

        // Decrement occupants
        room.occupants = Math.max(0, room.occupants - 1);
        await room.save();

        // Log activity
        await ActivityLog.create({
            action: 'DEALLOCATE',
            description: `${student.name} (${student.rollNo}) checked out from Room ${roomNo}`,
            roomNo,
            studentName: student.name,
        });

        // Remove room reference
        student.room = null;
        student.allocatedAt = null;
        await student.save();

        res.status(200).json({
            success: true,
            message: `${student.name} checked out from Room ${roomNo}`,
            data: student,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res, next) => {
    try {
        const { search, allocated } = req.query;
        const filter = { isActive: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { rollNo: { $regex: search, $options: 'i' } },
            ];
        }

        if (allocated === 'true') filter.room = { $ne: null };
        if (allocated === 'false') filter.room = null;

        const students = await Student.find(filter)
            .populate('room')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        next(error);
    }
};

// @desc    Get students by room
// @route   GET /api/students/room/:roomId
const getStudentsByRoom = async (req, res, next) => {
    try {
        const students = await Student.find({
            room: req.params.roomId,
            isActive: true,
        }).sort({ allocatedAt: -1 });

        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        next(error);
    }
};

// @desc    Export students as CSV
// @route   GET /api/students/export
const exportStudents = async (req, res, next) => {
    try {
        const students = await Student.find({ isActive: true }).populate('room').sort({ rollNo: 1 });

        const header = 'Roll No,Name,Phone,Email,Room No,Allocated At\n';
        const rows = students.map((s) =>
            `${s.rollNo},"${s.name}",${s.phone},${s.email},${s.room ? s.room.roomNo : 'N/A'},${s.allocatedAt ? s.allocatedAt.toISOString().split('T')[0] : 'N/A'}`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
        res.status(200).send(header + rows);
    } catch (error) {
        next(error);
    }
};

module.exports = { allocateStudent, deallocateStudent, getStudents, getStudentsByRoom, exportStudents };
