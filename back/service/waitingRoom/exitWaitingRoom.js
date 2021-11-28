const { WaitingRoomMember } = require('../../models');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;
    roomIdx = Number(roomIdx);
    let { user_idx } = res.locals.user.dataValues;

    try {
        await destroyWaitingRoom(user_idx, roomIdx);
        const io = req.app.get('io');

        if (res.locals.leader) {
            let newLeaderIdx = await assignNewReader(roomIdx);
            await updateWaitingRoomLeader(newLeaderIdx, roomIdx);
            let leader_data = { user_idx: newLeaderIdx };
            io.to(roomIdx).emit('change host', leader_data);
        }

        let memberCount = await getMemberCount(roomIdx);
        let member_data = { room_idx: roomIdx, room_member_count: memberCount };
        io.emit('change member count', member_data);
        io.to(roomIdx).emit('exit room', { user_idx });

        res.status(200).json('success');
    } catch (error) {
        console.log('exitWaitingRoom Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const destroyWaitingRoom = async (user_idx, roomIdx) => {
    await WaitingRoomMember.destroy({
        where: { user_user_idx: user_idx, room_room_idx: roomIdx },
    });
}

const assignNewReader = async (roomIdx) => {
    const newLeader = await WaitingRoomMember.findOne({
        attributes: ['user_user_idx'],
        where: { room_room_idx: roomIdx },
        order: sequelize.literal('rand()'),
    });

    return newLeader.dataValues.user_user_idx;
}

const updateWaitingRoomLeader = async (newLeaderIdx, roomIdx) => {
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

const getMemberCount = async (room_idx) => {
    const member = await WaitingRoomMember.findOne({
        attributes: [
            [sequelize.fn('count', sequelize.col('wrm_idx')), 'memberCount'],
        ],
        where: {
            room_room_idx: room_idx,
        },
    });

    let { memberCount } = member.dataValues;
    console.log(memberCount);
    return memberCount;
};

module.exports.destroyWaitingRoom = destroyWaitingRoom;