/**
 * O(n) Room Allocation Algorithm
 *
 * Iterates through rooms exactly once (single pass).
 * Finds the smallest valid room that satisfies:
 *   - remaining capacity >= students requested
 *   - AC requirement matches (if needed)
 *   - Attached washroom requirement matches (if needed)
 *
 * No sorting is performed — the algorithm is strictly O(n).
 *
 * @param {Array} rooms         - Array of room documents
 * @param {Number} students     - Number of students to allocate
 * @param {Boolean} needsAC     - Whether AC is required
 * @param {Boolean} needsWashroom - Whether attached washroom is required
 * @returns {Object|null}       - Best matching room or null
 */
const findBestRoom = (rooms, students, needsAC, needsWashroom) => {
    let bestRoom = null;
    let bestRemaining = Infinity;

    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        const remaining = room.capacity - room.occupants;

        // Skip rooms that don't have enough remaining capacity
        if (remaining < students) continue;

        // Skip rooms that don't have AC when it's required
        if (needsAC && !room.hasAC) continue;

        // Skip rooms that don't have attached washroom when it's required
        if (needsWashroom && !room.hasAttachedWashroom) continue;

        // Pick the room with the smallest remaining capacity (best fit)
        if (remaining < bestRemaining) {
            bestRoom = room;
            bestRemaining = remaining;
        }
    }

    return bestRoom;
};

module.exports = { findBestRoom };
