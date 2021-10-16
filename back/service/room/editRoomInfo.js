const { Room } = require('../../models');

module.exports = async (req, res, next) => {
    let { room_idx, room_name, room_mode, room_start_member_cnt } = req.body;
    room_idx = Number(room_idx);

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

        res.status(200).json('success');
    } catch (error) {
        console.log('getRoomInfoService Error: ', error);
    }
};
