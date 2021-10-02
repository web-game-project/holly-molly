const express = require('express');
const { getRoomList, makeRoom, enterRoom, getRoomInfo, editRoomInfo, deleteRoom } = require('../service').roomService;

const router = express.Router();

router.get('/', getRoomList);
router.post('/', makeRoom);
router.post('/:type', enterRoom);
router.get('/info/:roomIdx', getRoomInfo);
router.put('/info', editRoomInfo);
router.delete('/:roomIdx', deleteRoom);

module.exports = router;
