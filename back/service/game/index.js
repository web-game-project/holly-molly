const getInterimResult = require('./getInterimResult');
const getFinalResult = require('./getFinalResult');
const { startGame } = require('./startGame');
const getGameMemberInfo = require('./getGameMemberInfo');
const finishGame = require('./finishGame');
const { exitGame } = require('./exitGame');
const startSet = require('./startSet');
const vote = require('./vote');
const getVoteResult = require('./getVoteResult');
const writeHumanKeyword = require('./writeHumanKeyword');

module.exports = {
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
};
