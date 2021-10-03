const { WaitingRoomMember } = require('../../models');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;
    let userIdx = 1;

    try {
        const isLeader = await WaitingRoomMember.findOne({
            attributes: ['wrm_leader'],
            where: { user_user_idx: userIdx, room_room_idx: roomIdx },
        });

        await WaitingRoomMember.destroy({
            where: { user_user_idx: userIdx, room_room_idx: roomIdx },
        });

        let newLeaderIdx = 0;

        if (isLeader.dataValues.wrm_leader) {
            //방장이라면
            const newLeader = await WaitingRoomMember.findOne({
                attributes: ['user_user_idx'],
                order: sequelize.literal('rand()'),
                where: { room_room_idx: roomIdx }
            });

            console.log(newLeader);
            newLeaderIdx = newLeader.dataValues.user_user_idx;

            await WaitingRoomMember.update(
                {
                    wrm_leader: 1,
                },
                { where: { user_user_idx: newLeaderIdx, room_room_idx: roomIdx } }
            );
        }

        const member = await WaitingRoomMember.findAll({
            attributes: [
                [
                    sequelize.fn('count', sequelize.col('wrm_idx')),
                    'memberCount',
                ],
            ],
            where: {
                room_room_idx: roomIdx,
            }
        });

        console.log(member[0].dataValues);
        let { memberCount } = member[0].dataValues;
        console.log(memberCount);

        const io = req.app.get('io');
        let member_data = { room_idx: roomIdx, room_member_count: memberCount};
        io.to(roomIdx).emit('change member count', member_data);

        if (newLeaderIdx > 0) {
            let leader_data = { user_idx: newLeaderIdx };
            io.to(roomIdx).emit('change host', leader_data);
        }

        res.status(200).json('success');
    } catch (error) {
        console.log('getRoomInfoService Error: ', error);
    }
};
