const { Room, Game, GameSet, GameMember, GameVote } = require('../../models');
const moveRoom = require('../../socket/moveRoom');

module.exports = async (req, res, next) => {
    try {
        // user와 관련된 정보들 get

        // game 중이면, 방장/마피아/시민 정보 확인

        // 방장 권한 옮기기

        // 마피아이면 게임 끝내기

        // 게임에서 나가기 (투표는 냅두기)

        // 대기실에서 나가기

        // user 정보 없애기

        // 소켓 - 게임 인원 바뀜 표시 (대기실 리스트 & 대기실)

        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
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

