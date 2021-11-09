const db = require('../../models');
const moveRoom = require('../../socket/moveRoom');
const getIOSocket = require('../../socket/getIOSocket');

module.exports = async (req, res, next) => {
    try {
        const { page, room_mode, room_start_member_cnt, is_waiting } = req.query;

        let offset;
        if (!page) {
            offset = 0;
        } else {
            offset = 6 * (page - 1);
        }

        const rooms = await getRoomList(
            offset,
            room_mode,
            room_start_member_cnt,
            is_waiting
        );

        // socket : get socket
        const { io, socket } = getIOSocket(req,res);
        if(!io || !socket){
            //console.log("*****", io, socket);
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
        console.log("[getRoomList]",error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

const getRoomList = async (offset, roomMode, startMember, isWaiting) => {
    console.log(typeof(roomMode), typeof(startMember), typeof(isWaiting))
    
    let room_mode = '("easy","hard")'; 
    let room_start_member_cnt = '(4, 5, 6)'; 
    let room_status = '("waiting","playing")'; 
    if (roomMode) {
        if(typeof(roomMode)=='object')
            room_mode=`("`+roomMode.join(`","`)+`")`; 
        else
            room_mode = `("${roomMode}")`; 
    } 
    if (startMember) {
        if(typeof(startMember)=='object')
            room_start_member_cnt = '('+startMember.join(',')+')'
        else
            room_start_member_cnt = `(${startMember})`; 
    }
    if (isWaiting=="true"){
        room_status = '("waiting")';
    }

    const roomCount = await db.sequelize.query(
        `SELECT COUNT(*) as cnt FROM Room
        WHERE room_mode IN ${room_mode} AND room_start_member_cnt IN ${room_start_member_cnt} AND room_status IN ${room_status} AND room_private != 1`,
        { type: db.sequelize.QueryTypes.SELECT }
    );
    const roomList = await db.sequelize.query(
        `SELECT room_idx, room_name, room_mode, room_start_member_cnt, count(room_idx) as room_current_member_cnt, room_status FROM Room
        LEFT OUTER JOIN WaitingRoomMember as wrm
        ON room_idx = room_room_idx
        WHERE room_mode IN ${room_mode} AND room_start_member_cnt IN ${room_start_member_cnt} AND room_status IN ${room_status} AND room_private != 1
        GROUP BY room_idx
        ORDER BY room_status DESC, room_current_member_cnt DESC 
        LIMIT ${offset}, 6`,
        { type: db.sequelize.QueryTypes.SELECT }
    );

    return { roomCount: roomCount[0].cnt, roomList };
};
