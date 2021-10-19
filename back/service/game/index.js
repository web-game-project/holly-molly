const getInterimResult = require('./getInterimResult');
const getFinalResult = require('./getFinalResult');
const { startGame } = require('./startGame');
const getGameMemberInfo = require('./getGameMemberInfo');
const finishGame = require('./finishGame');
const { exitGame } = require('./exitGame');

module.exports = {
    getInterimResult,
    getFinalResult,
    startGame,
    getGameMemberInfo,
    finishGame,
    exitGame,
};
