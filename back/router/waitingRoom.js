const express = require('express');
const router = express.Router();
const { changeUserReady, changeUserColor } = require('../service/waitingRoom');

router.patch('/user-ready', changeUserReady);
router.patch('/user-color', changeUserColor);

module.exports = router;