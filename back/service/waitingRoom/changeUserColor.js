const { WaitingRoomMember } = require('../../models');
const { waitingRoomSchema } = require('../../util/joi/schema');

module.exports = async (req, res, next) => {
    let { user_idx } = res.locals.user.dataValues;

    const { error, value } = waitingRoomSchema.color.validate(req.body);
    let { room_idx, user_color } = value;
    if(error){
        res.status(400).json({
            error: error.details[0].message
        });

        return;
    }

    try {
        let before_color = await getBeforeUserColor(user_idx, room_idx);
        if(before_color == user_color){
            res.status(400).json({
                meesage: '현재의 색상과 같습니다.'
            });
            return;
        }

        if(await isUseColor(room_idx, user_color)){
            res.status(400).json({
                meesage: '이미 사용 중인 색입니다.'
            });
            return;
        }

        await updateUserColor(user_idx, user_color, room_idx);

        const io = req.app.get('io');
        let data = { user_idx, before_color, current_color: user_color };
        io.to(room_idx).emit('change member color', data);

        res.status(200).end();
    } catch (error) {
        console.log('changeUserColor Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const isUseColor = async (room_idx, user_color) => {
    const existColor = await WaitingRoomMember.findAll(
        {
            attributes: [
                'wrm_idx',
            ],
            where: { room_room_idx: room_idx, wrm_user_color: user_color } 
        },
    );

    if(existColor.length != 0)
        return true;
    else
        return false;
}

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