const express = require('express');
const { getRoomInfoService, editRoomInfoService } = require('../service/room');

const router = express.Router();

router.get('/info/:roomIdx', getRoomInfoService);
router.put('/info', editRoomInfoService);

module.exports = router;
