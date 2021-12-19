const express = require('express');
const {
    getRoomList,
    makeRoom,
    enterRoom,
    getRoomInfo,
    editRoomInfo,
    deleteRoom,
    getRoom,
} = require('../service').roomService;
const { authMiddleware, roomMiddleware } = require('../middleware');

const router = express.Router();

router.get('/', getRoomList);
router.post('/', makeRoom);
router.post('/:type', enterRoom);
router.get('/info/:roomIdx', roomMiddleware, getRoomInfo);
router.put('/info', roomMiddleware, editRoomInfo);
router.delete('/:roomIdx', roomMiddleware, deleteRoom);
router.get('/:roomIdx', roomMiddleware, getRoom);

module.exports = router;
