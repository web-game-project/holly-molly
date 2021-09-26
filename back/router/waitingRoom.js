const express = require('express');
const { changeUserReady, changeUserColor } = require('../service').waitingRoomService;

const router = express.Router();

//router.patch('/user-ready', changeUserReady);
//router.patch('/user-color', changeUserColor);

module.exports = router;