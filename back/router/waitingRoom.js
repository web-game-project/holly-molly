const express = require('express');
const { changeUserReady, changeUserColor, exitWaitingRoom } =
    require('../service').waitingRoomService;
const { roomMiddleware } = require('../middleware');
const router = express.Router();

router.patch('/user-ready', roomMiddleware, changeUserReady);
router.patch('/user-color', roomMiddleware, changeUserColor);
router.delete('/exit/:roomIdx', roomMiddleware, exitWaitingRoom);

module.exports = router;
