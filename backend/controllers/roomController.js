const Room = require('../models/Room');
const Student = require('../models/Student');
const ActivityLog = require('../models/ActivityLog');
const { findBestRoom } = require('../utils/allocator');

// @desc    Create a new room
// @route   POST /api/rooms
const createRoom = async (req, res, next) => {
    try {
        const { roomNo, capacity, hasAC, hasAttachedWashroom } = req.body;

        if (!roomNo || !capacity) {
            res.status(400);
            throw new Error('Room number and capacity are required');
        }

        const room = await Room.create({
            roomNo,
            capacity,
            hasAC: hasAC || false,
            hasAttachedWashroom: hasAttachedWashroom || false,
        });

        await ActivityLog.create({
            action: 'ROOM_CREATED',
            description: `Room ${roomNo} created (capacity: ${capacity})`,
            roomNo,
        });

        res.status(201).json({ success: true, data: room });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all rooms (with filters)
// @route   GET /api/rooms
const getRooms = async (req, res, next) => {
    try {
        const { search, hasAC, hasAttachedWashroom, availability } = req.query;
        const filter = {};

        if (search) filter.roomNo = Number(search);
        if (hasAC !== undefined) filter.hasAC = hasAC === 'true';
        if (hasAttachedWashroom !== undefined) filter.hasAttachedWashroom = hasAttachedWashroom === 'true';

        let rooms = await Room.find(filter).sort({ roomNo: 1 });

        // Filter by availability in JS (since it depends on virtual)
        if (availability === 'available') {
            rooms = rooms.filter((r) => r.occupants < r.capacity);
        } else if (availability === 'full') {
            rooms = rooms.filter((r) => r.occupants >= r.capacity);
        }

        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single room with occupants
// @route   GET /api/rooms/:id
const getRoomDetail = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            res.status(404);
            throw new Error('Room not found');
        }

        const students = await Student.find({ room: room._id, isActive: true })
            .sort({ allocatedAt: -1 });

        res.status(200).json({ success: true, data: { room, students } });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/rooms/stats
const getStats = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        const students = await Student.find({ isActive: true, room: { $ne: null } });

        const stats = {
            totalRooms: rooms.length,
            totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
            acRooms: rooms.filter((r) => r.hasAC).length,
            washroomRooms: rooms.filter((r) => r.hasAttachedWashroom).length,
            availableRooms: rooms.filter((r) => r.occupants < r.capacity).length,
            fullRooms: rooms.filter((r) => r.occupants >= r.capacity).length,
            totalStudents: students.length,
        };

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

// @desc    Allocate a room (legacy — kept for backward compat)
// @route   POST /api/rooms/allocate
const allocateRoom = async (req, res, next) => {
    try {
        const { students, needsAC, needsWashroom } = req.body;

        if (!students || students < 1) {
            res.status(400);
            throw new Error('Number of students must be at least 1');
        }

        const rooms = await Room.find();
        const bestRoom = findBestRoom(rooms, students, needsAC, needsWashroom);

        if (!bestRoom) {
            return res.status(200).json({
                success: true,
                allocated: false,
                message: 'No room available matching the given requirements',
                data: null,
            });
        }

        bestRoom.occupants += students;
        await bestRoom.save();

        res.status(200).json({
            success: true,
            allocated: true,
            message: `Room ${bestRoom.roomNo} allocated successfully`,
            data: bestRoom,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset room (remove all occupants)
// @route   POST /api/rooms/:id/reset
const resetRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            res.status(404);
            throw new Error('Room not found');
        }

        // Deallocate all students
        await Student.updateMany(
            { room: room._id, isActive: true },
            { room: null, allocatedAt: null }
        );

        const prevOccupants = room.occupants;
        room.occupants = 0;
        await room.save();

        await ActivityLog.create({
            action: 'ROOM_RESET',
            description: `Room ${room.roomNo} reset — ${prevOccupants} occupants removed`,
            roomNo: room.roomNo,
        });

        res.status(200).json({
            success: true,
            message: `Room ${room.roomNo} has been reset`,
            data: room,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            res.status(404);
            throw new Error('Room not found');
        }

        // Deallocate students first
        await Student.updateMany(
            { room: room._id, isActive: true },
            { room: null, allocatedAt: null }
        );

        await ActivityLog.create({
            action: 'ROOM_DELETED',
            description: `Room ${room.roomNo} deleted`,
            roomNo: room.roomNo,
        });

        await Room.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Export rooms as CSV
// @route   GET /api/rooms/export
const exportRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find().sort({ roomNo: 1 });

        const header = 'Room No,Capacity,Occupants,Remaining,AC,Washroom,Status\n';
        const rows = rooms.map((r) =>
            `${r.roomNo},${r.capacity},${r.occupants},${r.capacity - r.occupants},${r.hasAC ? 'Yes' : 'No'},${r.hasAttachedWashroom ? 'Yes' : 'No'},${r.occupants >= r.capacity ? 'Full' : 'Available'}`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=rooms.csv');
        res.status(200).send(header + rows);
    } catch (error) {
        next(error);
    }
};

module.exports = { createRoom, getRooms, getRoomDetail, getStats, allocateRoom, resetRoom, deleteRoom, exportRooms };
