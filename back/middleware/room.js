const { WaitingRoomMember } = require('../models');

module.exports = async (req, res, next) => {
    // room_idx와 user 정보 가지고 방장/방원 체크
    try {
        const user = res.locals.user;
        const { room_idx } = req.body;
        const { roomIdx } = req.params;

        // db 처리
        const realRoomIdx = (!room_idx) ? roomIdx : room_idx;
      
        // SELECT * FROM hollymolly.WaitingRoomMember WHERE room_room_idx = 1 AND user_user_idx = 1;
        const roomMember = await WaitingRoomMember.findOne({
            where:{
                room_room_idx: realRoomIdx,
                user_user_idx: user.user_idx
            }
        });
    
        if(!roomMember){
            res.status(403).send({
                message: '대기실/게임의 참여자가 아닙니다.',
            });
            return;
        }
  
        res.locals.leader = (roomMember.wrm_leader==1) ? true : false; // or false
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 에러가 발생하였습니다.',
        });
        return;
    }
};

