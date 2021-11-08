const express = require('express');
const router = express.Router();
const { upload } = require('../util/uploadFile');

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
    saveSetImage
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
router.patch('/set/image/:gameSetIdx', gameMiddleware, upload.single("set_image"), saveSetImage);

module.exports = router;
