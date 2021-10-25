const express = require('express');
const {
    getRoomList,
    makeRoom,
    enterRoom,
    getRoomInfo,
    editRoomInfo,
    deleteRoom,
} = require('../service').roomService;
const { authMiddleware, roomMiddleware } = require('../middleware');

const router = express.Router();

router.get('/', getRoomList);
router.post('/', makeRoom);
router.post('/:type', enterRoom);
router.get('/info/:roomIdx', roomMiddleware, getRoomInfo);
router.put('/info', roomMiddleware, editRoomInfo);
router.delete('/:roomIdx', roomMiddleware, deleteRoom);

module.exports = router;
