const { Room } = require('../../models');
const { getMemberCountInfo } = require('../game/startGame');

module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;

    try {
        const memberCnt = await getMemberCountInfo(roomIdx);
        
        if(memberCnt != 0){
            res.status(400).json({
                message: '대기방에 플레이어가 남아있습니다.'
            });
        }

        await Room.destroy({ where: { room_idx: roomIdx } });

        const io = req.app.get('io');
        let data = { room_idx: roomIdx };
        io.to('0').emit('delete room', data);

        res.status(200).json('success');
    } catch (error) {
        console.log('deleteRoom Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};