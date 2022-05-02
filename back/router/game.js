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
    getTopVoteResult,
    writeHumanKeyword,
    saveSetImage,
    getKeywordLength,
    getChat
} = require('../service').gameService;
const { roomMiddleware, gameMiddleware } = require('../middleware');

router.post('/start', roomMiddleware, startGame);
router.get('/interim-result/:gameIdx', gameMiddleware, getInterimResult);
router.delete('/final/:gameIdx', gameMiddleware, getFinalResult);
router.get('/member/:gameSetIdx', gameMiddleware, getGameMemberInfo);
router.delete('/exit', exitGame);
router.post('/set', gameMiddleware, startSet);
router.post('/vote', gameMiddleware,vote);
router.get('/vote-result/:gameSetIdx', gameMiddleware, getVoteResult);
router.get('/top-vote-result/:gameSetIdx', gameMiddleware, getTopVoteResult);
router.patch('/human-keyword', gameMiddleware, writeHumanKeyword);
router.patch('/set/image/:gameSetIdx', gameMiddleware, upload.single("set_image"), saveSetImage);
router.get('/keyword-length/:gameSetIdx', gameMiddleware, getKeywordLength);
router.get('/chat/:roomIdx', roomMiddleware, getChat);

module.exports = router;
