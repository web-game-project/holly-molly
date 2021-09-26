const { Room } = require('../../models');

module.exports = async (req, res, next) => {
    let { room_idx, room_name, room_mode, room_start_member_cnt } = req.body;

    switch (room_mode) {
        case 'easy':
            room_mode = 0;
            break;
        case 'hard':
            room_mode = 1;
            break;
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

        res.status(200).json("success");
    } catch (error) {
        console.log('getRoomInfoService Error: ', error);
    }
};