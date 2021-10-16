const db = require('../../models');
const moveRoom = require('../../socket/moveRoom');
const getIOSocket = require('../../socket/getIOSocket');

module.exports = async (req, res, next) => {
    try {
        const { room_start_row, room_mode, room_start_member_cnt } = req.query;

        let offset;
        if (!room_start_row) {
            offset = 0;
        } else {
            offset = 6 * (room_start_row - 1);
        }

        const rooms = await getRoomList(
            offset,
            room_mode,
            room_start_member_cnt
        );

        // socket : get socket
        const { io, socket } = getIOSocket(req,res);
        if(!io || !socket){
            res.status(400).json({
                message: 'socket connection을 다시 해주세요.',
            });
            return;
        }
        // socket : join room 0
        moveRoom(io, socket, 0);


        res.json({
            total_room_cnt: rooms.roomCount,
            room_list: rooms.roomList,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

const getRoomList = async (offset, roomMode, startMember) => {
    let room_mode = '("easy","hard")'; //[0,1]
    let room_start_member_cnt = '(4, 5, 6)'; //[4,5,6]
    if (roomMode) {
        room_mode = `("${roomMode}")`; //[roomMode]
    } 
    if (startMember) {
        room_start_member_cnt = `(${startMember})`; //[startMember]
    }

    const roomCount = await db.sequelize.query(
        `SELECT COUNT(*) as cnt FROM Room
        WHERE room_mode IN ${room_mode} AND room_start_member_cnt IN ${room_start_member_cnt} AND room_private != 1`,
        { type: db.sequelize.QueryTypes.SELECT }
    );
    const roomList = await db.sequelize.query(
        `SELECT room_idx, room_name, room_mode, room_start_member_cnt, count(room_idx) as room_current_member_cnt, room_status FROM Room
        LEFT OUTER JOIN WaitingRoomMember as wrm
        ON room_idx = room_room_idx
        WHERE room_mode IN ${room_mode} AND room_start_member_cnt IN ${room_start_member_cnt} AND room_private != 1
        GROUP BY room_idx
        LIMIT ${offset}, 9`,
        { type: db.sequelize.QueryTypes.SELECT }
    );

    return { roomCount: roomCount[0].cnt, roomList };
};
