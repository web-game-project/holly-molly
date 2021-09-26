const { GameSet } = require('../../models');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {
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
