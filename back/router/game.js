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
router.get('/interim-result/:gameIdx', gameMiddleware, getInterimResult);
router.get('/final-result/:gameIdx', gameMiddleware, getFinalResult);
router.get('/member/:gameIdx', gameMiddleware, getGameMemberInfo);
router.delete('/:gameIdx', authMiddleware, gameMiddleware, finishGame);
router.delete('/exit', authMiddleware, exitGame);

module.exports = router;
