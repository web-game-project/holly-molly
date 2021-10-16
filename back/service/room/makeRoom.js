const { Room, WaitingRoomMember } = require('../../models');
const moveRoom = require('../../socket/moveRoom');
const getIOSocket = require('../../socket/getIOSocket');
const makeRandomCode = require('../../util/makeRandomCode');

module.exports = async (req, res, next) => {
    try {
        const { room_name, room_mode, room_private, room_start_member_cnt } =
            req.body;
        const user = res.locals.user;

        let roomCode = await makeRoomCode();
        const room = await Room.create({
            room_code: roomCode,
            room_name,
            room_mode,
            room_private,
            room_start_member_cnt,
            room_status: 'waiting',
        });
        await WaitingRoomMember.create({
            wrm_user_color: 'RED',
            wrm_leader: true,
            wrm_user_ready: false,
            room_room_idx: room.room_idx,
            user_user_idx: user.user_idx,
        });

        // socket : get socket
        const { io, socket } = getIOSocket(req,res);
        if(!io || !socket){
            res.status(400).json({
                message: 'socket connection을 다시 해주세요.',
            });
            return;
        }
        // socket : join room room_idx
        moveRoom(io, socket, room.room_idx);

        // 대기실 리스트 보는 사람들에게 socket event 전송
        if (!room.room_private) {
            const io = req.app.get('io');
            io.to(0).emit('create room', {
                room_idx: room.room_idx,
                room_name: room.room_name,
                room_mode: room.room_mode,
                room_start_member_cnt: room.room_start_member_cnt,
                room_current_member_cnt: 1,
                room_status: room.room_status,
            });
        }

        res.status(201).json({
            room_idx: room.room_idx,
            room_code: room.room_code,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '알 수 없는 오류가 발생했습니다.' });
    }
};

const makeRoomCode = async () => {
    let roomCode;
    let duplicatedRoomCode;
    do {
        roomCode = makeRandomCode(7);
        duplicatedRoomCode = await Room.findOne({
            where: { room_code: roomCode },
        });
    } while (duplicatedRoomCode);
    return roomCode;
};
