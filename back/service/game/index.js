const getInterimResult = require('./getInterimResult');
const { getFinalResult } = require('./getFinalResult');
const { startGame } = require('./startGame');
const getGameMemberInfo = require('./getGameMemberInfo');
const { exitGame } = require('./exitGame');
const startSet = require('./startSet');
const vote = require('./vote');
const { getVoteResult } = require('./getVoteResult');
const saveSetImage = require('./saveSetImage');
const writeHumanKeyword = require('./writeHumanKeyword');
const {getTopVoteResult} = require('./getTopVoteResult');
const getChat = require('./getChat');
const {getKeywordLength} = require('./getKeywordLength');

module.exports = {
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
    getChat,
    getKeywordLength
};
