const { Room } = require('../../models');
const { getMemberCountInfo } = require('../game/startGame');

module.exports = async (req, res, next) => {
    if (!res.locals.leader) {
        res.status(403).json({
            message: '권한이 없습니다.',
        });

        return;
    }
    
    let { room_idx, room_name, room_mode, room_start_member_cnt } = req.body;
    room_idx = Number(room_idx);
    const memberCnt = await getMemberCountInfo(room_idx);

    if(memberCnt > room_start_member_cnt){
        res.status(400).json({
            message: `${memberCnt} 보다 적은 플레이어 수로는 변경할 수 없습니다`,
        });

        return;
    }

    try {
        await Room.update(
            {
                room_idx,
                room_name,
                room_mode,
                room_start_member_cnt,
            },
            { where: { room_idx } }
        );

        const io = req.app.get('io');
        let data = { room_idx, room_name, room_mode, room_start_member_cnt };
        io.to(room_idx).emit('edit room', data);

        res.status(200).end();
    } catch (error) {
        console.log('editRoom Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};
