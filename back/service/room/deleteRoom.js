const { Room } = require('../../models');
const { getMemberCountInfo } = require('../game/startGame');
const { destroyWaitingRoom } = require('../waitingRoom/exitWaitingRoom');

module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;

    try {
        const memberCnt = await getMemberCountInfo(roomIdx);

        if (!res.locals.leader) {
            res.status(403).json({
                message: '권한이 없습니다.',
            });
            return;
        }

        if(memberCnt != 1){
            res.status(400).json({
                message: '대기방에 플레이어가 남아있습니다.'
            });
            return;
        }

        let { user_idx } = res.locals.user.dataValues;
        await destroyWaitingRoom(user_idx, roomIdx);

        await destroyRoom(roomIdx);

        const io = req.app.get('io');
        let data = { room_idx: roomIdx };
        io.to(0).emit('delete room', data);

        res.status(200).json('success');
    } catch (error) {
        console.log('deleteRoom Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const destroyRoom = async (roomIdx) => {
    await Room.destroy({ where: { room_idx: roomIdx } });
}