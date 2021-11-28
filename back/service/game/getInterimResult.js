const { GameSet } = require('../../models');
const sequelize = require('sequelize');
const { getGame } = require('./getFinalResult');

module.exports = async (req, res, next) => {
    let { gameIdx } = req.params;

    try {
        const { human_score, ghost_score } = await selectInterimResult(gameIdx);

        let winner = "same";

        if(human_score < ghost_score)
            winner = "ghost";
        else if(human_score > ghost_score)
            winner = "human";

        const io = req.app.get('io');
        const game = await getGame(gameIdx);
        let room_idx = game.get('room_room_idx');
        io.to(room_idx).emit('get interim result', {winner});

        res.status(200).end();
    } catch (error) {
        console.log('getInterimResult Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const selectInterimResult = async (gameIdx) => {
    const interimResult = await GameSet.findOne({
        attributes: [
            [
                sequelize.fn('sum', sequelize.col('game_set_human_score')),
                'human_score',
            ],
            [
                sequelize.fn('sum', sequelize.col('game_set_ghost_score')),
                'ghost_score',
            ]
        ],
        where: {
            game_game_idx: gameIdx,
            game_set_no: [1, 2],
        },
        group: 'game_game_idx',
    });

    return interimResult.dataValues;
};
