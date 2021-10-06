const { Room, Game, GameSet, GameMember, GameVote } = require('../../models');
const moveRoom = require('../../socket/moveRoom');

module.exports = async (req, res, next) => {
    try {
        const { gameIdx } = req.params;

        // 방장이 아닌 경우
        if (!res.locals.leader) {
            res.staus(403).json({
                message: '권한이 없습니다.',
            });
        }

        const gameMembers = await getGameMemberIndex(gameIdx);
        const game = await getGame(gameIdx);
        await deleteGame(gameMembers, game);
        const room = await updateRoomStatus('waiting', game.get('room_room_idx'))

        // socket : change game status
        const io = req.app.get('io');
        io.to(0).emit('change game status', {
            room_idx: room.room_idx,
            room_status: room.room_status,
        });

        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
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

const deleteGame = async (gameMembers, gameIdx) => {
    let gameMemberIdx = [];
    for (member of gameMembers) {
        gameMemberIdx.push(member.get('game_member_idx'));
    }

    await GameVote.destroy({
        where: {
            game_member_game_member_idx: gameMemberIdx,
        },
    });
    await GameMember.destroy({
        where: {
            game_member_idx: gameMemberIdx,
        },
    });
    await GameSet.destroy({
        where: {
            game_game_idx: gameIdx,
        },
    });
    await Game.destroy({
        where: {
            game_idx: gameIdx,
        },
    });
};

const updateRoomStatus = async (roomStatus, roomIdx) => {
    return await Room.update(
        { room_status: roomStatus },
        {
            where: {
                room_idx: roomIdx,
            },
        }
    );
}