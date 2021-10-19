const express = require('express');
const router = express.Router();
const {
    getInterimResult,
    getFinalResult,
    startGame,
    getGameMemberInfo,
    finishGame,
    exitGame,
} = require('../service').gameService;
const { authMiddleware, gameMiddleware } = require('../middleware');

router.post('/start', startGame);
router.get('/interim-result/:gameIdx', getInterimResult);
router.get('/final-result/:gameIdx', getFinalResult);
router.get('/member/:gameIdx', getGameMemberInfo);
router.delete('/:gameIdx', authMiddleware, gameMiddleware, finishGame);
router.delete('/exit', authMiddleware, exitGame);

module.exports = router;
