const { WaitingRoomMember } = require('../../models');
const sequelize = require('sequelize');
const getIOSocket = require('../../socket/getIOSocket');
const moveRoom = require('../../socket/moveRoom');

module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;
    roomIdx = Number(roomIdx);
    let { user_idx, user_name } = res.locals.user.dataValues;
    let { color }  = res.locals;

    try {
        const { io, socket } = getIOSocket(req, res);
        
        // socket : get socket
        if (!io || !socket) {
            console.log('[error]-getRoomList: 소켓 커넥션 에러');
            res.status(400).json({
                message: 'socket connection을 다시 해주세요.',
            });
            return;
        }

        await destroyWaitingRoom(user_idx, roomIdx);

        if (res.locals.leader) {
            let newLeaderIdx = await assignNewReader(roomIdx);
            if(newLeaderIdx != 0){
                await updateWaitingRoomLeader(newLeaderIdx, roomIdx);
                let leader_data = { user_idx: newLeaderIdx };
                io.to(roomIdx).emit('change host', leader_data);
                let ready_data = { user_idx: newLeaderIdx, user_ready: false };
                io.to(roomIdx).emit('change member ready', ready_data);
            }
        }

        let memberCount = await getMemberCount(roomIdx);
        let member_data = { room_idx: roomIdx, room_member_count: memberCount };
        io.to(roomIdx).emit('change member count', member_data);
        io.to(0).emit('change member count', member_data);
        io.to(roomIdx).emit('exit room', { user_idx, user_color: color, user_name });

        // socket : join room room_idx
        moveRoom(io, socket, 0);

        res.status(200).end();
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

    if(newLeader)
        return newLeader.dataValues.user_user_idx;
    else
        return 0;
}

const updateWaitingRoomLeader = async (newLeaderIdx, roomIdx) => {
    await WaitingRoomMember.update(
        {
            wrm_leader: 1,
            wrm_user_ready: 0
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

    return memberCount;
};

module.exports.destroyWaitingRoom = destroyWaitingRoom;