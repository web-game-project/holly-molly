const { WaitingRoomMember } = require('../../models');

module.exports = async (req, res, next) => {
    let { user_color } = req.body;
    let user_idx = 1;
    let room_idx = 1;

    try {
        await WaitingRoomMember.update(
            {
                wrm_user_color: user_color,
            },
            { where: { user_user_idx: user_idx } } 
        );

        const io = req.app.get('io');
        let data = { user_idx, user_color }
        console.log(data);
        io.to(room_idx).emit('change member color', data);

        res.status(200).json('success');
    } catch (error) {
        console.log('***********', error);
    }
}