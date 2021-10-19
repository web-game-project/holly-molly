const { Room, Game, GameSet, GameMember, GameVote } = require('../../models');
const moveRoom = require('../../socket/moveRoom');

const exitGame = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { game, gameMember } = await getGameAndMember(user.user_idx);
        const { room, roomMember } = await getRoomAndMember(user.user_idx);
        const memberList = await getMemberList(room.get('room_idx')); //roomMember+gameMemberIdx
        const isLeader = roomMember.get('wrm_leader');
        const io = req.app.get('io');

        if(memberList.size()==1){
            await deleteAllAboutGame(memberList, game.get('game_idx')); // game, gameMember, gameSet, gameVote 삭제
            await deleteRoomAndMember(roomMember.get('wrm_idx'), room.get('room_idx')); // room, roomMember 삭제
            await deleteUser(user.user_idx);

            io.to(0).emit('delete room', { room_idx: room.get('room_idx')});
            res.status(204).end();
            return;
        }

        if(game){
            if(gameMember.get('game_member_role')=='human'){
                // 게임 종료 처리 (game, gameMember, gameSet, gameVote 삭제)
                await deleteAllAboutGame(memberList, game.get('game_idx'));
                await deleteUser(user.user_idx);

                // 최종 결과 이벤트
                const finalResult = await getFinalResult(game.get('game_idx'));
                io.to(room.get('room_idx')).emit('get final result', finalResult);

                // game status 이벤트
                await updateRoomStatus(room.get('room_idx'));
                io.to(0).emit('change game status', { room_idx:room.get('room_idx'), room_status:"waiting"});
            }
        } 

        if(isLeader){
            const hostIdx = changeHost(memberList, user.user_idx);
            io.to(0).emit('change host', { user_idx: hostIdx });
        }

        if(gameMember){
            await deleteGameMember(gameMember.game_member_idx);
        }
        if(roomMember){
            await deleteRoomMember(roomMember.wrm_idx);
        }
        io.to(0).emit('change member count', { room_idx: room.get('room_idx'), room_member_count: memberList.size()-1 });
        io.to(room.get('room_idx')).emit('exit room', {user_idx: user.user_idx});

        await deleteUser(user.user_idx);

        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

const getGameAndMember = async (userIdx) => {

}
const getRoomAndMember = async (userIdx) => {

}
const getMemberList = async (roomIdx) => {

}
const deleteRoomAndMember = async (wrmIdx, roomIdx) => {

}

const deleteAllAboutGame = async (gameMembers, gameIdx) => {
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

const deleteUser = async (userIdx) => {

}

const getFinalResult = async (gameIdx) => {

}

const updateRoomStatus = async (roomIdx) => {
    await Room.update(
        { room_status: 'waiting' },
        {
            where: {
                room_idx: roomIdx,
            },
        }
    );
}

const changeHost = async (memberList, userIdx) => {

}

const deleteGameMember = async (gameMemberIdx) => {

}

const deleteRoomMember = async (wrmIdx) => {

}

module.exports = {
    exitGame,

}