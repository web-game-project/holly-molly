const express = require('express');
const router = express.Router();
const { getInterimResult, getFinalResult, startGame, getGameMemberInfo } = require('../service').gameService;

router.post('/start', startGame);
router.get('/interim-result/:gameIdx', getInterimResult);
router.get('/final-result/:gameIdx', getFinalResult);
router.get('/member/:gameIdx', getGameMemberInfo);

module.exports = router;