const { GameSet, GameMember, Game } = require('../../models');
const sequelize = require('sequelize');
const { deleteAllAboutGame, updateRoomStatus } = require('./exitGame');

module.exports = async (req, res, next) => {
    let { gameIdx } = req.params;

    if (!res.locals.leader) {
        res.status(403).json({
            message: '권한이 없습니다.',
        });
    }

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

        // finishGame
        const gameMembers = await getGameMemberIndex(gameIdx);
        const game = await getGame(gameIdx);
        await deleteAllAboutGame(gameMembers, gameIdx);
        await updateRoomStatus(game.get('room_room_idx'), 'waiting');

        // socket : change game status
        const io = req.app.get('io');
        io.to(0).emit('change game status', {
            room_idx: game.get('room_room_idx'),
            room_status: 'waiting',
        });

        res.status(204).end();
        //res.status(200).json(finalResult);
    } catch (error) {
        console.log('getFinalResult Error: ', error);
    }
};

const getGameMemberIndex = async (gameIdx) => {
    return await GameMember.findAll({
        attributes: ['game_member_idx'],
        where: {
            game_game_idx: gameIdx,
        },
    });
};
const getGame = async (gameIdx) => {
    return await Game.findOne({
        where: {
            game_idx: gameIdx,
        },
    });
};
