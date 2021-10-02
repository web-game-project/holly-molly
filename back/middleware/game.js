const { GameSet, GameMember, WaitingRoomMember } = require('../models');

module.exports = async (req, res, next) => {
    // game_set_idx, game_idx와 user 정보 가지고 방장/방원/마피아/시민인지 체크
    try {
        const user = res.locals.user;
        const { game_set_idx, game_idx } = req.body;
        const { gameSetIdx, gameIdx } = req.params;

        
        let realGameSetIdx = (!game_set_idx) ? gameSetIdx : game_set_idx;
        let realGameIdx = (!game_idx) ? gameIdx : game_idx;

        if ( !realGameIdx ){
            const gameSet = await GameSet.findOne({
                attributes: [ 'game_game_idx' ],
                where: {
                    game_set_idx: realGameSetIdx
                }
            });
            if(!gameSet){
                res.status(400).send({
                    message: '존재하는 게임이 아닙니다.',
                });
                return;
            }
            realGameIdx = gameSet.game_game_idx;
        }

        // SELECT GameMember.*, WaitingRoomMember.wrm_leader FROM GameMember INNER JOIN WaitingRoomMember ON wrm_idx = wrm_wrm_idx
        // WHERE game_game_idx =1 AND wrm_user_idx = 1;
        const gameMember = await GameMember.findOne({
            include: [
                {
                    model: WaitingRoomMember,
                    as : 'wrm_wrm_idx_WaitingRoomMember',
                    required: false,
                    attributes: ['wrm_leader']
                },
            ],
            where:{
                game_game_idx: realGameIdx,
                wrm_user_idx: user.user_idx
            }
        });

        if(!gameMember){
            res.status(403).send({
                message: '대기실/게임의 참여자가 아닙니다.',
            });
            return;
        }

        res.locals.gameIdx = realGameIdx;
        res.locals.leader = gameMember.wrm_wrm_idx_WaitingRoomMember.wrm_leader;
        res.locals.role = gameMember.game_member_role; 
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 에러가 발생하였습니다.',
        });
        return;
    }
};

