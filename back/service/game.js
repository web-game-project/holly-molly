const { GameSet } = require('../models');
const sequelize = require('sequelize');

module.exports.getInterimResult = async (req, res, next) => {
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
    }
};

module.exports.getFinalResult = async (req, res, next) => {
    let { gameIdx } = req.params;

    try {
        const finalResult = await GameSet.findOne({
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
            },
            group: 'game_game_idx',
        });
        console.log('getFinalResult Success: ', finalResult);
        res.status(200).json(finalResult);
    } catch (error) {
        console.log('getFinalResult Error: ', error);
    }
};
