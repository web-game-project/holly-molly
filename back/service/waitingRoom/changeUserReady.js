const { WaitingRoomMember } = require('../../models');
const { waitingRoomSchema } = require('../../util/joi/schema');

module.exports = async (req, res, next) => {
    let { user_idx } = res.locals.user.dataValues;

    const { error, value } = waitingRoomSchema.ready.validate(req.body);
    let { room_idx, user_ready } = value;
    if(error){
        res.status(400).json({
            error: error.details[0].message
        });

        return;
    }

    try {
        await WaitingRoomMember.update(
            {
                wrm_user_ready: user_ready,
            },
            { where: { user_user_idx: user_idx, room_room_idx: room_idx } }
        );

        const io = req.app.get('io');
        let data = { user_idx, user_ready };
        io.to(room_idx).emit('change member ready', data);

        res.status(200).end();
    } catch (error) {
        console.log('changeUserReady Error:', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};
