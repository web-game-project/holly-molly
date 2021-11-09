const { Room, Game, GameSet, GameMember, GameVote, WaitingRoomMember, User } = require('../../models');

const exitGame = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const io = req.app.get('io');

        const isSuccess = await exitGameAndRoom(user, io);
        if(!isSuccess)  throw "exitGame fail";
        await deleteUser(user.user_idx);

        res.status(204).end();
    } catch (error) {
        console.log('[error]-exitGame: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error,
        });
    }
};

const exitGameAndRoom = async (user, io) => {
    try {
        const { game, gameMember } = await getGameAndMember(user.user_idx);
        const { room, roomMember } = await getRoomAndMember(user.user_idx);
        if(!gameMember && !roomMember)  return true;

        const memberList = await getMemberList(room.get('room_idx')); //roomMember+gameMemberIdx
        const isLeader = roomMember.get('wrm_leader');

        console.log("****exitGame test - ",memberList);
        if (memberList.length <= 1) {
            if(game){
                await deleteAllAboutGame(memberList, game.get('game_idx')); // game, gameMember, gameSet, gameVote 삭제
            }
            await deleteRoomAndMember(
                roomMember.get('wrm_idx'),
                room.get('room_idx')
            ); // room, roomMember 삭제

            io.to(0).emit('delete room', { room_idx: room.get('room_idx') });
            return true;
        }

        if (game) {
            if (gameMember.get('game_member_role') == 'human') {
                // 게임 종료 처리 (game, gameMember, gameSet, gameVote 삭제)
                await deleteAllAboutGame(memberList, game.get('game_idx'));

                // 최종 결과 이벤트
                const finalResult = await getFinalResult(game.get('game_idx'));
                io.to(room.get('room_idx')).emit(
                    'get final result',
                    finalResult
                );

                // game status 이벤트
                await updateRoomStatus(room.get('room_idx'), 'waiting');
                io.to(0).emit('change game status', {
                    room_idx: room.get('room_idx'),
                    room_status: 'waiting',
                });
            }
        }

        if (isLeader) {
            const hostIdx = await changeHost(memberList, user.user_idx);
            io.to(room.get('room_idx')).emit('change host', { user_idx: hostIdx });
        }

        if (gameMember) {
            await deleteGameVote(gameMember.game_member_idx);
            await deleteGameMember(gameMember.game_member_idx);
        }
        if (roomMember) {
            await deleteRoomMember(roomMember.wrm_idx);
        }
        io.to(0).emit('change member count', {
            room_idx: room.get('room_idx'),
            room_member_count: memberList.length - 1,
        });
        io.to(room.get('room_idx')).emit('exit room', {
            user_idx: user.user_idx,
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const getGameAndMember = async (userIdx) => {
    let gameMember = await GameMember.findOne({
        where: { wrm_user_idx: userIdx },
    });

    let game;
    if(gameMember){
        game = await Game.findOne({
            where: { game_idx: gameMember.get('game_game_idx') },
        });
    }
    return { game, gameMember };
};
const getRoomAndMember = async (userIdx) => {
    let roomMember = await WaitingRoomMember.findOne({
        where: { user_user_idx: userIdx },
    });

    let room;
    if(roomMember){
        room = await Room.findOne({
            where: { room_idx: roomMember.get('room_room_idx') },
        });
    }
    return { room, roomMember };
};
const getMemberList = async (roomIdx) => {
    const memberList = await WaitingRoomMember.findAll({
        include: [{ model: GameMember, required: false, as: 'GameMembers' }],
        where: { room_room_idx: roomIdx },
    });
   
    return memberList;
};
const deleteRoomAndMember = async (wrmIdx, roomIdx) => {
    await WaitingRoomMember.destroy({
        where: {
            wrm_idx: wrmIdx,
        },
    });
    await Room.destroy({
        where: {
            room_idx: roomIdx,
        },
    });
};
const deleteAllAboutGame = async (members, gameIdx) => {
    let gameMemberIdx = [];
    for (const member of members) {
        try {
            gameMemberIdx.push(member.get('GameMembers')[0].get('game_member_idx'));
        } catch (error) {
            gameMemberIdx.push(member.get('game_member_idx'));   
        }
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
const deleteUser = async (userIdx) => {
    await User.destroy({
        where: {
            user_idx: userIdx,
        },
    });
};
const getFinalResult = async (gameIdx) => {
    const setResult = await GameSet.findAll({
        attributes: [
            'game_set_no',
            'game_set_human_score',
            'game_set_ghost_score',
        ],
        where: {
            game_game_idx: gameIdx,
        },
    });

    const finalResult = {};
    const finalHumanScore = 0;
    const finalGhostScore = 0;

    for (result of setResult) {
        if (result.get('game_set_no') == 1) {
            finalResult['one_game_set_human_score'] = result.get(
                'game_set_human_score'
            );
            finalResult['one_game_set_ghost_score'] = result.get(
                'game_set_ghost_score'
            );
        } else if (result.get('game_set_no') == 1) {
            finalResult['two_game_set_human_score'] = result.get(
                'game_set_human_score'
            );
            finalResult['two_game_set_ghost_score'] = result.get(
                'game_set_ghost_score'
            );
        } else {
            finalResult['three_game_set_human_score'] = result.get(
                'game_set_human_score'
            );
            finalResult['three_game_set_ghost_score'] = result.get(
                'game_set_ghost_score'
            );
        }
        finalHumanScore += result.get('game_set_human_score');
        finalGhostScore += result.get('game_set_ghost_score');
    }
    finalResult['total_game_set_human_score'] = finalHumanScore;
    finalResult['total_game_set_ghost_score'] = finalGhostScore;

    return finalResult;
};
const updateRoomStatus = async (roomIdx, status) => {
    await Room.update(
        { room_status: status },
        {
            where: {
                room_idx: roomIdx,
            },
        }
    );
};
const changeHost = async (memberList, userIdx) => {
    const hostIdx =
        memberList[0].get('user_user_idx') != userIdx
            ? memberList[0].get('user_user_idx')
            : memberList[1].get('user_user_idx');
   
    await WaitingRoomMember.update(
        {
            wrm_leader: true,
        },
        {
            where: { user_user_idx: hostIdx },
        }
    );
    return hostIdx;
};
const deleteGameVote = async (gameMemberIdx) => {
    await GameVote.destroy({
        where: {
            game_member_game_member_idx: gameMemberIdx,
        },
    });
};
const deleteGameMember = async (gameMemberIdx) => {
    await GameMember.destroy({
        where: {
            game_member_idx: gameMemberIdx,
        },
    });
};
const deleteRoomMember = async (wrmIdx) => {
    await WaitingRoomMember.destroy({
        where: {
            wrm_idx: wrmIdx,
        },
    });
};

module.exports = {
    exitGame,
    exitGameAndRoom,
    deleteAllAboutGame,
    updateRoomStatus,
    deleteGameVote,
    deleteGameMember,
    deleteRoomMember,
    deleteUser,
};
