const express = require('express');
const { changeUserReady, changeUserColor, exitWaitingRoom } = require('../service').waitingRoomService;

const router = express.Router();

router.patch('/user-ready', changeUserReady);
router.patch('/user-color', changeUserColor);
router.delete('/exit/:roomIdx', exitWaitingRoom);

module.exports = router;