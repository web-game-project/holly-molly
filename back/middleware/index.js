const authMiddleware = require('./auth');
const roomMiddleware = require('./room');
const gameMiddleware = require('./game');

module.exports = {
    authMiddleware,
    roomMiddleware,
    gameMiddleware,
};
