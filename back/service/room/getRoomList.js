const db = require('../../models');
const moveRoom = require('../../socket/moveRoom');
const getIOSocket = require('../../socket/getIOSocket');
const {printErrorLog, printLog} = require('../../util/log');
const { roomSchema } = require('../../util/joi/schema');

module.exports = async (req, res, next) => {
    try {
        const { error, value } = roomSchema.filter.validate(req.query);
        const { page, room_mode, room_start_member_cnt, is_waiting } = value;
        if(error){
            res.status(400).json({
                error: error.details[0].message
            });
            return;
        }
        
        printLog("getRoomList", res.locals.user.user_idx+" "+typeof room_mode+" "+typeof room_start_member_cnt+" "+typeof is_waiting);
        let offset;
        if (!page) {
            offset = 0;
        } else {
            offset = 6 * (page - 1); //0,6,12,18,...
        }

        const rooms = await getRoomList(
            offset,
            room_mode,
            room_start_member_cnt,
            is_waiting
        );

        /*
        // socket : get socket
        const { io, socket } = getIOSocket(req, res);
        if (!io || !socket) {
            printErrorLog('getRoomList', '소켓 연결이 안되어있음');
            res.status(400).json({
                message: 'socket connection을 다시 해주세요.',
            });
            return;
        }
        // socket : join room 0
        moveRoom(io, socket, 0);
        */
       
        res.json({
            total_room_cnt: rooms.roomCount,
            room_list: rooms.roomList,
        });
    } catch (error) {
        printErrorLog('getRoomList', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const getRoomList = async (offset, roomMode, startMember, isWaiting) => {
    let room_mode = '("easy","hard")';
    let room_start_member_cnt = '(4, 5, 6)';
    let room_status = '("waiting","playing")';
    if (roomMode) {
        if (typeof roomMode == 'object')
            room_mode = `("` + roomMode.join(`","`) + `")`;
        else room_mode = `("${roomMode}")`;
    }
    if (startMember) {
        if (typeof startMember == 'object')
            room_start_member_cnt = '(' + startMember.join(',') + ')';
        else room_start_member_cnt = `(${startMember})`;
    }
    if (isWaiting == true) {
        room_status = '("waiting")';
    }

    let roomFilterQuery = `SELECT room_idx, room_name, room_mode, room_start_member_cnt, count(room_idx) as room_current_member_cnt, room_status FROM Room
        INNER JOIN WaitingRoomMember as wrm
        ON room_idx = room_room_idx
        WHERE room_mode IN ${room_mode} AND room_start_member_cnt IN ${room_start_member_cnt} AND room_status IN ${room_status} AND room_private != 1
        GROUP BY room_idx
        ORDER BY room_status DESC, room_current_member_cnt DESC, room_idx DESC`;

    const roomCount = await db.sequelize.query(
        `SELECT COUNT(*) as cnt FROM (${roomFilterQuery}) filterQuery`,
        { type: db.sequelize.QueryTypes.SELECT }
    );
    const roomList = await db.sequelize.query(
        `${roomFilterQuery} LIMIT ${offset}, 6`,
        { type: db.sequelize.QueryTypes.SELECT }
    );

    return { roomCount: roomCount[0].cnt, roomList };
};
