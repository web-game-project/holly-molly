const express = require('express');
const { getRoomInfo, editRoomInfo, deleteRoom } = require('../service').roomService;

const router = express.Router();

router.get('/info/:roomIdx', getRoomInfo);
router.put('/info', editRoomInfo);
router.delete('/:roomIdx', deleteRoom);

module.exports = router;
