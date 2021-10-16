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
            },
            { where: { room_idx: roomIdx } }
        );
        console.log('getRoomInfoService Success: ', roomInfo);

        res.status(200).json(roomInfo);
    } catch (error) {
        console.log('getRoomInfoService Error: ', error);
    }
};
