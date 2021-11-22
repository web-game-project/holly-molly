const { Room } = require('../../models');

module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;

    try {
        const roomInfo = await Room.findOne(
            {
                attributes: [
                    'room_idx',
                    'room_name',
                    'room_code',
                    'room_private',
                    'room_mode',
                    'room_start_member_cnt',
                ],
                where: { room_idx: roomIdx } 
            },
        );
        console.log('getRoomInfo Success: ', roomInfo);

        res.status(200).json(roomInfo);
    } catch (error) {
        console.log('getRoomInfo Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};
