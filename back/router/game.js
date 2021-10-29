const express = require('express');
const router = express.Router();
const {
    getInterimResult,
    getFinalResult,
    startGame,
    getGameMemberInfo,
    exitGame,
    startSet,
    vote,
    getVoteResult,
    writeHumanKeyword,
} = require('../service').gameService;
const { authMiddleware, gameMiddleware } = require('../middleware');

router.post('/start', startGame);
router.get('/interim-result/:gameIdx', gameMiddleware, getInterimResult);
router.delete('/final/:gameIdx', gameMiddleware, getFinalResult);
router.get('/member/:gameSetIdx', gameMiddleware, getGameMemberInfo);
router.delete('/exit', exitGame);
router.post('/set', gameMiddleware, startSet);
router.post('/vote', gameMiddleware,vote);
router.get('/vote-result/:gameSetIdx', gameMiddleware, getVoteResult);
router.patch('/human-keyword', gameMiddleware, writeHumanKeyword);

module.exports = router;
