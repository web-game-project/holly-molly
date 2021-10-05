const express = require('express');
const { getRoomList, makeRoom, enterRoom, getRoomInfo, editRoomInfo, deleteRoom } = require('../service').roomService;
const {authMiddleware} = require('../middleware');

const router = express.Router();

router.get('/', authMiddleware, getRoomList);
router.post('/', authMiddleware, makeRoom);
router.post('/:type', enterRoom);
router.get('/info/:roomIdx', getRoomInfo);
router.put('/info', editRoomInfo);
router.delete('/:roomIdx', deleteRoom);

module.exports = router;
