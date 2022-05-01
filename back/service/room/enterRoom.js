const { Room, WaitingRoomMember } = require('../../models');
var Sequelize = require('sequelize');
const getIOSocket = require('../../socket/getIOSocket');
const moveRoom = require('../../socket/moveRoom');
const db = require('../../models');
const { exitGameAndRoom } = require('../game/exitGame');
const {printErrorLog, printLog} = require('../../util/log');
const { roomSchema } = require('../../util/joi/schema');

const enterRoom = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { io, socket } = getIOSocket(req, res);
        const { type } = req.params;

        const { error, value } = roomSchema.join.validate(req.body);
        
        if(error){
            res.status(400).json({
                error: error.details[0].message
            });
            return;
        }

        let room = await findRoom(type, value);
        if (room.room_status != 'waiting') {
            res.status(400).json({
                message: '게임이 이미 시작되었습니다.',
            });
            return;
        }

        // user가 이미 방에 들어가 있는 상태는 아닌지 체크하기
        const beforeWaitingRoomMember = await getWaitingRoomMember(
            user.user_idx
        );

        if (!room) {
            res.status(400).json({
                message: '방이 존재하지 않습니다.',
            });
            return;
        }

        // 이미 다른 방에 입장해 있는 경우
        const flagToDeleteBeforeMember =
            beforeWaitingRoomMember &&
            (beforeWaitingRoomMember.get('room_room_idx') != room.room_idx);
        // 이미 room.room_idx 방에 입장해 있는 경우
        const flagToReconnect =
            beforeWaitingRoomMember &&
            (beforeWaitingRoomMember.get('room_room_idx') == room.room_idx);

        // 이미 다른 방에 입장해 있는 경우 과거방에서 퇴장
        if (flagToDeleteBeforeMember) {
            await exitGameAndRoom(user, io); 
        }

        // 들어가고자 하는 방에 있는 멤버 리스트와 방장 구하기
        const { waitingRoomMemberList, leader_idx } =
            await getWaitingRoomMemberListAndLeader(room.room_idx);

        if (!waitingRoomMemberList || !leader_idx) {
            printErrorLog('getRoom', room.room_idx+'번방 방원/방장이 존재하지 않음');
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }

        let insertedMember;
        // 방에 입장해있지 않은 경우
        if(!flagToReconnect){
            // 이미 방 정원이 가득 찬 경우
            if (room.room_start_member_cnt <= waitingRoomMemberList.length) {
                res.status(400).json({
                    message: '방의 정원이 가득 찼습니다.',
                });
                return;
            }

            // 방에 입장 처리
            insertedMember = await insertWaitingRoomMember(
                waitingRoomMemberList,
                user,
                room.room_idx
            );
            await updateCurrentMemberCnt(
                waitingRoomMemberList.length+1,
                room.room_idx
            );
        }else{
            insertedMember = beforeWaitingRoomMember;
        }
        
        // socket : get socket
        if (!io || !socket) {
            printErrorLog("enterRoom","소켓 커넥션 에러-io or socket이 undefined");
            res.status(400).json({
                message: 'socket connection을 다시 해주세요.',
            });
            return;
        }

        // socket : enter room
        io.to(room.room_idx).emit('enter room', {
            user_idx: user.user_idx,
            user_name: user.user_name,
            user_color: insertedMember.wrm_user_color,
        });

        printLog("enterRoom", user.user_idx+"번 유저 "+socket.id);
        // socket : join room room_idx
        moveRoom(io, socket, room.room_idx);

        // socket : change member count
        io.to(0).emit('change member count', {
            room_idx: room.room_idx,
            room_member_count: (flagToReconnect) ? waitingRoomMemberList.length : waitingRoomMemberList.length+1 ,
        });

        res.status(201).json({
            room_idx: room.room_idx,
        });

        printLog("enterRoom", user.user_idx+"번 유저 "+room.room_idx+"방 입장 rest api 완료");
    } catch (error) {
        printErrorLog('enterRoom', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const findRoom = async (type, condition) => {
    try {
        let room;
        if (type === 'idx') {
            const { room_idx } = condition;
            room = Room.findOne({
                where: {
                    room_idx,
                    room_private: false,
                },
            });
        } else if (type === 'code') {
            const { room_code } = condition;
            room = Room.findOne({
                where: {
                    room_code,
                },
            });
        } else if (type === 'random') {
            const { room_mode, room_start_member_cnt } = condition; 
           
            let roomMode = '("easy","hard")';
            let startMember = '(4, 5, 6)';
            if (room_mode) {
                if (typeof room_mode == 'object')
                    roomMode = `("` + room_mode.join(`","`) + `")`;
                else roomMode = `("${room_mode}")`;
            }
            if (room_start_member_cnt) {
                if (typeof room_start_member_cnt == 'object')
                    startMember = '(' + room_start_member_cnt.join(',') + ')';
                else startMember = `(${room_start_member_cnt})`;
            }

            const randomRoomQuery = `SELECT room1.* FROM Room room1
                INNER JOIN (SELECT room_idx, room_start_member_cnt, count(room_idx) as room_current_member_cnt FROM Room
                INNER JOIN WaitingRoomMember as wrm
                ON room_idx = room_room_idx
                WHERE room_mode IN ${roomMode} AND room_start_member_cnt IN ${startMember} AND room_status IN ('waiting') AND room_private != 1 
                GROUP BY room_idx) as room2
                ON room1.room_idx = room2.room_idx
                WHERE room1.room_start_member_cnt != room2.room_current_member_cnt
                ORDER BY RAND() LIMIT 1`;
            
            room = await db.sequelize.query(
                randomRoomQuery,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            
            if(room.length==0){
                room = undefined
            }else{
                room = room[0];
            }

        } else {
            return undefined;
        }
        return room;
    } catch (error) {
        printErrorLog('enterRoom-findRoom', error);
        return undefined;
    }
};

const getWaitingRoomMemberListAndLeader = async (roomIdx) => {
    try {
        const waitingRoomMemberList = await db.sequelize.query(
            `SELECT user_idx, user_name, wrm_user_color, wrm_user_ready 
            FROM WaitingRoomMember
            INNER JOIN User
            ON User.user_idx = user_user_idx
            WHERE room_room_idx = ${roomIdx}`,
            { type: db.sequelize.QueryTypes.SELECT }
        );

        const leader_idx = await WaitingRoomMember.findOne({
            attributes: [['user_user_idx', 'leader_idx']],
            where: {
                wrm_leader: true,
                room_room_idx: roomIdx,
            },
        });

        for (let memberIndex in waitingRoomMemberList){
            waitingRoomMemberList[memberIndex].wrm_user_ready = waitingRoomMemberList[memberIndex].wrm_user_ready ? true : false;
        }

        const result = {
            waitingRoomMemberList,
            leader_idx: leader_idx.get('leader_idx'),
        };
        return result;
    } catch (error) {
        printErrorLog('enterRoom-getWaitingRoomMemberListAndLeader', error);
        return { undefined, undefined };
    }
};

const insertWaitingRoomMember = async (
    waitingRoomMemberList,
    user,
    roomIdx
) => {
    try {
        // "RED","ORANGE","YELLOW","GREEN","BLUE","PURPLE","PINK"
        let colorSet = new Set()
            .add('RED')
            .add('ORANGE')
            .add('YELLOW')
            .add('GREEN')
            .add('BLUE')
            .add('PURPLE')
            .add('PINK');
        let insertedMember = undefined;
        for (let roomMember of waitingRoomMemberList) {
            colorSet.delete(roomMember.wrm_user_color);
        }
        let color = colorSet.values().next().value;

        insertedMember = await WaitingRoomMember.create({
            wrm_user_color: color,
            wrm_leader: false,
            wrm_user_ready: false,
            room_room_idx: roomIdx,
            user_user_idx: user.user_idx,
        });
        return insertedMember;
    } catch (error) {
        printErrorLog('enterRoom-insertWaitingRoomMember', error);
        return undefined;
    }
};
const updateCurrentMemberCnt = async (currentMember, roomIdx) => {
    await Room.update(
        {
            room_current_member_cnt: currentMember,
        },
        { where: { room_idx: roomIdx } }
    );
};
const getWaitingRoomMember = async (userIdx) => {
    let roomMember = await WaitingRoomMember.findOne({
        where: {
            user_user_idx: userIdx,
        },
    });
    return roomMember;
};

module.exports = {
    enterRoom,
    getWaitingRoomMemberListAndLeader,
}
