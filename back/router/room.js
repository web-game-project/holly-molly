const express = require('express');
const { getRoomInfo, editRoomInfo } = require('../service').roomService;

const router = express.Router();

router.get('/info/:roomIdx', getRoomInfo);
router.put('/info', editRoomInfo);

module.exports = router;
