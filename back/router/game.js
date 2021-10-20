const express = require('express');
const router = express.Router();
const {
    getInterimResult,
    getFinalResult,
    startGame,
    getGameMemberInfo,
    finishGame,
    exitGame,
    startSet,
    vote,
    getVoteResult,
    writeHumanKeyword,
} = require('../service').gameService;
const { authMiddleware, gameMiddleware } = require('../middleware');

router.post('/start', startGame);
router.get('/interim-result/:gameIdx', getInterimResult);
router.get('/final-result/:gameIdx', getFinalResult);
router.get('/member/:gameIdx', getGameMemberInfo);
router.delete('/:gameIdx', authMiddleware, gameMiddleware, finishGame);
router.delete('/exit', authMiddleware, exitGame);
router.post('/set', authMiddleware, gameMiddleware, startSet);
router.post('/vote',authMiddleware,gameMiddleware,vote);
router.get('/vote-result/:gameSetIdx', authMiddleware, gameMiddleware, getVoteResult);
router.patch('/human-keyword', authMiddleware, gameMiddleware, writeHumanKeyword);

module.exports = router;
