const { Chat, Room, Game, GameSet, GameMember, GameVote, WaitingRoomMember, User } = require('../../models');
const {printErrorLog, printLog} = require('../../util/log');
const {selectFinalResult, selectHuman, deleteAllAboutGame, updateRoomStatus, updateMemberReady, deleteChatByRoomIdx} = require('./getFinalResult');

const exitGame = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const io = req.app.get('io');

        const isSuccess = await exitGameAndRoom(user, io);
        if(!isSuccess)  throw "exitGame fail"; 
        await deleteUser(user.user_idx);

        res.status(204).end();
    } catch (error) {
        printErrorLog('exitGame', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const exitGameAndRoom = async (user, io) => {
    try {
        const { game, gameMember } = await getGameAndMember(user.user_idx);
        const { room, roomMember } = await getRoomAndMember(user.user_idx);
        if(!gameMember && !roomMember)  return true;

        await deleteChatByUserIdx(user.user_idx);

        const memberList = await getMemberList(room.get('room_idx')); //roomMember+gameMemberIdx
        const isLeader = roomMember.get('wrm_leader');

        if (memberList.length <= 1) { // 방 폭파
            await deleteChatByRoomIdx(room.get('room_idx'));
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

        io.to(room.get('room_idx')).emit('exit room', {
            user_idx: user.user_idx,
            user_name: user.user_name,
        });

        if (game) { // in game
            if (gameMember.get('game_member_role') == 'human' || memberList.length <= 3) { // human role or member count
                // 최종 결과 이벤트
                const result = await selectFinalResult(game.get('game_idx'));
                let human_info = await selectHuman(game.get('game_idx'));
                result.human_color = human_info[0].wrm_user_color;
                result.human_name = human_info[0].user_name;
                io.to(room.get('room_idx')).emit('get final result', result);

                // 게임 종료 처리 (chat / game, gameMember, gameSet, gameVote 삭제)
                await deleteChatByRoomIdx(room.get('room_idx'));
                await deleteAllAboutGame(memberList, game.get('game_idx'));
                // game status
                await updateRoomStatus(room.get('room_idx'), 'waiting');
                
                io.to(0).emit('change game status', {
                    room_idx: room.get('room_idx'),
                    room_status: 'waiting',
                });
                printLog('exitGameAndRoom', room.get('room_idx')+"번 room 게임 종료");

                // ready 상태 변경
                updateMemberReady(room.get('room_idx'));
            }else{ // ghost role
                await deleteGameVote(gameMember.game_member_idx);
                await deleteGameMember(gameMember.game_member_idx);
            }
        }

        if (isLeader) {
            const hostIdx = await changeHost(memberList, user.user_idx);
            io.to(room.get('room_idx')).emit('change host', { user_idx: hostIdx });
        }

        if (roomMember) {
            await deleteRoomMember(roomMember.wrm_idx);
        }

        io.to(0).emit('change member count', {
            room_idx: room.get('room_idx'),
            room_member_count: memberList.length - 1,
        });

        return true;
    } catch (error) {
        printErrorLog('exitGame-exitGameAndRoom', error);
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
const deleteUser = async (userIdx) => {
    await User.destroy({
        where: {
            user_idx: userIdx,
        },
    });
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

const deleteChatByUserIdx = async (userIdx) => {
    await Chat.destroy({
        where: {
            user_user_idx: userIdx,
        },
    });
}

module.exports = {
    exitGame,
    exitGameAndRoom,
    deleteGameVote,
    deleteGameMember,
    deleteRoomMember,
    deleteUser,
};
