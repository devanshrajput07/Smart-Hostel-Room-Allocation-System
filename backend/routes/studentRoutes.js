const express = require('express');
const router = express.Router();
const {
    allocateStudent,
    deallocateStudent,
    getStudents,
    getStudentsByRoom,
    exportStudents,
} = require('../controllers/studentController');

router.get('/export', exportStudents);
router.post('/allocate', allocateStudent);
router.post('/:id/deallocate', deallocateStudent);
router.get('/room/:roomId', getStudentsByRoom);
router.get('/', getStudents);

module.exports = router;
