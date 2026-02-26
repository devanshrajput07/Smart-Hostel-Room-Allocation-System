const express = require('express');
const router = express.Router();
const {
    createRoom,
    getRooms,
    getRoomDetail,
    getStats,
    allocateRoom,
    resetRoom,
    deleteRoom,
    exportRooms,
} = require('../controllers/roomController');

router.get('/stats', getStats);
router.get('/export', exportRooms);
router.post('/allocate', allocateRoom);
router.post('/:id/reset', resetRoom);
router.route('/').get(getRooms).post(createRoom);
router.route('/:id').get(getRoomDetail).delete(deleteRoom);

module.exports = router;
