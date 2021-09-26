const { Room } = require('../../models');

module.exports.deleteRoom = async (req, res, next) => {
    let { room_idx } = req.params;

    try {
        await Room.destroy(
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
