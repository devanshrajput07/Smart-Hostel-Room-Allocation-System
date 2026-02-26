const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
    {
        roomNo: {
            type: Number,
            required: [true, 'Room number is required'],
            unique: true,
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1'],
        },
        hasAC: {
            type: Boolean,
            default: false,
        },
        hasAttachedWashroom: {
            type: Boolean,
            default: false,
        },
        occupants: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

roomSchema.virtual('remainingCapacity').get(function () {
    return this.capacity - this.occupants;
});

roomSchema.virtual('isFull').get(function () {
    return this.occupants >= this.capacity;
});

roomSchema.set('toJSON', { virtuals: true });
roomSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Room', roomSchema);
