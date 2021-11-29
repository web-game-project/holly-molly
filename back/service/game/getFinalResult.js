const { GameSet, GameMember, Game, sequelize } = require('../../models');
const { deleteAllAboutGame, updateRoomStatus } = require('./exitGame');

module.exports = async (req, res, next) => {
    let { gameIdx } = req.params;

    if (!res.locals.leader) {
        res.status(403).json({
            message: '권한이 없습니다.',
        });

        return;
    }

    try {
        const io = req.app.get('io');

        // get room_idx using gameIdx
        const game = await getGame(gameIdx);
        let room_idx = game.get('room_room_idx');

        // get final result
        const finalResult = await selectFinalResult(gameIdx);
        let result = await makeTotalScoreData(finalResult);
        io.to(room_idx).emit('get final result', result);

        // finishGame
        const gameMembers = await getGameMemberIndex(gameIdx);
        await deleteAllAboutGame(gameMembers, gameIdx);
        await updateRoomStatus(room_idx, 'waiting');

        // socket : change game status
        io.to(0).emit('change game status', {
            room_idx: game.get('room_room_idx'),
            room_status: 'waiting',
        });
        

        res.status(204).end();
    } catch (error) {
        console.log('getFinalResult Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const selectFinalResult = async (gameIdx) => {
    const finalResult = await GameSet.findAll({
        attributes: [
            'game_set_human_score',
            'game_set_ghost_score'
        ],
        where: {
            game_game_idx: gameIdx,
        },
        order: ['game_set_no']
    });

    return finalResult;
};

const makeTotalScoreData = async (finalResult) => {
    let result = {};
    result.one_game_set_human_score = finalResult[0].dataValues.game_set_human_score;
    result.two_game_set_human_score = finalResult[1].dataValues.game_set_human_score;
    result.three_game_set_human_score = finalResult[2].dataValues.game_set_human_score;
    result.total_game_set_human_score = 0;
    for(let i in finalResult){
        result.total_game_set_human_score += finalResult[i].dataValues.game_set_human_score;
    }
    result.one_game_set_ghost_score = finalResult[0].dataValues.game_set_ghost_score;
    result.two_game_set_ghost_score = finalResult[1].dataValues.game_set_ghost_score;
    result.three_game_set_ghost_score = finalResult[2].dataValues.game_set_ghost_score;
    result.total_game_set_ghost_score = 0;
    for(let i in finalResult){
        result.total_game_set_ghost_score += finalResult[i].dataValues.game_set_ghost_score;
    }

    return result;
}

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

module.exports.getGame = getGame;