const { WaitingRoomMember } = require('../../models');
const sequelize = require('sequelize');

// 코드를 외부에서도 사용할 수 있게 모듈화하기
module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;
    roomIdx = Number(roomIdx);
    let { user_idx } = res.locals.user.dataValues;

    try {
        const isLeader = await WaitingRoomMember.findOne({
            attributes: ['wrm_leader'],
            where: { user_user_idx: user_idx, room_room_idx: roomIdx },
        });

        await WaitingRoomMember.destroy({
            where: { user_user_idx: user_idx, room_room_idx: roomIdx },
        });

        let newLeaderIdx = 0;

        // 방장이라면 이 부분 res.locals.leader 사용
        if (isLeader.dataValues.wrm_leader) {
            //방장이라면
            const newLeader = await WaitingRoomMember.findOne({
                attributes: ['user_user_idx'],
                where: { room_room_idx: roomIdx },
                order: sequelize.literal('rand()'),
            });

            newLeaderIdx = newLeader.dataValues.user_user_idx;

            await WaitingRoomMember.update(
                {
                    wrm_leader: 1,
                },
                {
                    where: {
                        user_user_idx: newLeaderIdx,
                        room_room_idx: roomIdx,
                    },
                }
            );
        }

        let memberCount = getMemberCount(roomIdx);

        const io = req.app.get('io');
        let member_data = { room_idx: roomIdx, room_member_count: memberCount };
        io.emit('change member count', member_data);

        if (newLeaderIdx > 0) {
            let leader_data = { user_idx: newLeaderIdx };
            io.to(roomIdx).emit('change host', leader_data);
        }

        io.to(roomIdx).emit('exit room', { user_idx });

        res.status(200).json('success');
    } catch (error) {
        console.log('exitWaitingRoom Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error,
        });
    }
};

const getMemberCount = async (room_idx) => {
    const member = await WaitingRoomMember.findAll({
        attributes: [
            [sequelize.fn('count', sequelize.col('wrm_idx')), 'memberCount'],
        ],
        where: {
            room_room_idx: room_idx,
        },
    });

    let { memberCount } = member[0].dataValues;

    return memberCount;
};


