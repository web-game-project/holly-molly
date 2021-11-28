const { WaitingRoomMember } = require('../../models');

module.exports = async (req, res, next) => {
    let { user_color } = req.body;
    let { user_idx } = res.locals.user.dataValues;
    let { room_idx } = req.body;

    try {
        let before_color = await getBeforeUserColor(user_idx, room_idx);
        await updateUserColor(user_idx, user_color, room_idx);

        const io = req.app.get('io');
        let data = { user_idx, before_color, current_color: user_color };
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

const getBeforeUserColor = async (user_idx, room_idx) => {
    const color = await WaitingRoomMember.findOne(
        {
            attributes: [
                'wrm_user_color',
            ],
            where: { user_user_idx: user_idx, room_room_idx: room_idx } 
        },
    );

    return color.dataValues.wrm_user_color;
}

const updateUserColor = async (user_idx, user_color, room_idx) => {
    await WaitingRoomMember.update(
        {
            wrm_user_color: user_color,
        },
        { where: { user_user_idx: user_idx, room_room_idx: room_idx } }
    );
}