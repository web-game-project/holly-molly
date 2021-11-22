const { GameSet } = require('../../models');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {
    let { gameIdx } = req.params;

    try {
        const interimResult = await GameSet.findOne({
            attributes: [
                [
                    sequelize.fn('sum', sequelize.col('game_set_human_score')),
                    'human_score',
                ],
                [
                    sequelize.fn('sum', sequelize.col('game_set_ghost_score')),
                    'ghost_score',
                ],
            ],
            where: {
                game_game_idx: gameIdx,
                game_set_no: [1, 2],
            },
            group: 'game_game_idx',
        });
        console.log('getInterimResult Success: ', interimResult);
        res.status(200).json(interimResult);
    } catch (error) {
        console.log('getInterimResult Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};
