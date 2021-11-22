const { WaitingRoomMember } = require('../../models');

module.exports = async (req, res, next) => {
    let { user_color } = req.body;
    let { user_idx } = res.locals.user.dataValues;
    let { room_idx } = req.body;

    try {
        await WaitingRoomMember.update(
            {
                wrm_user_color: user_color,
            },
            { where: { user_user_idx: user_idx, room_room_idx: room_idx } }
        );

        const io = req.app.get('io');
        let data = { user_idx, user_color };

        io.to(room_idx).emit('change member color', data);

        res.status(200).json('success');
    } catch (error) {
        console.log('changeUserColor Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};
