const { Room, WaitingRoomMember } = require('../../models');
var Sequelize = require('sequelize');
const getIOSocket = require('../../socket/getIOSocket');
const moveRoom = require('../../socket/moveRoom');
const db = require('../../models');

module.exports = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const room = await findRoom(req, res);

        if (!room) {
            res.status(400).json({
                message: '방이 존재하지 않습니다.',
            });
            return;
        }

        if (room.room_status != 'waiting') {
            res.status(400).json({
                message: '게임이 이미 시작되었습니다.',
            });
            return;
        }

        const { waitingRoomMemberList, leader_idx } =
            await getWaitingRoomMemberListAndLeader(room.room_idx);

        if (!waitingRoomMemberList || !leader_idx) {
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }

        if (room.room_start_member_cnt <= waitingRoomMemberList.length) {
            res.status(400).json({
                message: '방의 정원이 가득 찼습니다.',
            });
            return;
        }

        const insertedMember = await insertWaitingRoomMember(
            waitingRoomMemberList,
            user,
            room.room_idx
        );
        
        // socket : get socket
        const { io, socket } = getIOSocket(req,res);
        if(!io || !socket){
            res.status(400).json({
                message: 'socket connection을 다시 해주세요.',
            });
            return;
        }
        // socket : change member count
        io.to(room.room_idx).emit('enter room', {
            user_idx: user.user_idx,
            user_name: user.user_name,
            user_color: insertedMember.wrm_user_color,
        });
        // socket : join room room_idx
        moveRoom(io, socket, room.room_idx);

        // socket : enter room
        io.to(0).emit('change member count', {
            room_idx: room.room_idx,
            room_member_count: waitingRoomMemberList.length,
        });

        res.status(201).json({
            room_idx: room.room_idx,
            room_name: room.room_name,
            room_code: room.room_code,
            room_start_member_cnt: room.room_start_member_cnt,
            room_current_member_cnt: waitingRoomMemberList.length,
            leader_idx,
            waiting_room_member_list: waitingRoomMemberList,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

const findRoom = async (req, res) => {
    try {
        const { type } = req.params;

        let room;
        if (type === 'idx') {
            const { room_idx } = req.body;
            room = Room.findOne({
                where: {
                    room_idx,
                },
            });
        } else if (type === 'code') {
            const { room_code } = req.body;
            room = Room.findOne({
                where: {
                    room_code,
                },
            });
        } else if (type === 'random') {
            const { room_mode, room_start_member_cnt } = req.body;

            let roomMode;
            if (!room_mode) {
                roomMode = [0, 1];
            } else {
                roomMode = [room_mode];
            }

            let roomStartMemberCnt;
            if (!room_start_member_cnt) {
                roomStartMemberCnt = [4, 5];
            } else {
                roomStartMemberCnt = [room_start_member_cnt];
            }

            room = Room.findOne({
                where: {
                    room_mode: roomMode,
                    room_start_member_cnt: roomStartMemberCnt,
                    room_private: false,
                },
                order: Sequelize.literal('RAND()'),
                limit: 1,
            });
        } else {
            res.status(400).json({ message: '잘못된 type 입니다.' });
            return undefined;
        }
        return room;
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: '알 수 없는 오류가 발생했습니다.' });
        return undefined;
    }
};

const getWaitingRoomMemberListAndLeader = async (roomIdx) => {
    try {
        const waitingRoomMemberList = await db.sequelize.query(
            `SELECT user_idx, user_name, wrm_user_color, wrm_user_ready 
            FROM hollymolly.WaitingRoomMember
            INNER JOIN hollymolly.User
            ON User.user_idx = user_user_idx
            WHERE room_room_idx = ${roomIdx}`,
            { type: db.sequelize.QueryTypes.SELECT }
        );

        const leader_idx = await WaitingRoomMember.findOne({
            attributes: [['user_user_idx', 'leader_idx']],
            where: {
                wrm_leader: 1,
                room_room_idx: roomIdx,
            },
        });
        const result = {
            waitingRoomMemberList,
            leader_idx: leader_idx.get('leader_idx'),
        };
        return result;
    } catch (error) {
        console.log(error);
        return { undefined, undefined };
    }
};

const insertWaitingRoomMember = async (
    waitingRoomMemberList,
    user,
    roomIdx
) => {
    try {
        let colorSet = new Set().add(0).add(1).add(2).add(3).add(4).add(5);
        let insertedMember = undefined;
        for (let roomMember of waitingRoomMemberList) {
            if (roomMember.user_idx == user.user_idx) {
                insertedMember = roomMember;
                break;
            }
            colorSet.delete(roomMember.wrm_user_color);
        }
        let color = colorSet.values().next().value;

        if (!insertedMember) {
            insertedMember = await WaitingRoomMember.create({
                wrm_user_color: color,
                wrm_leader: 0,
                wrm_user_ready: 0,
                room_room_idx: roomIdx,
                user_user_idx: user.user_idx,
            });
            waitingRoomMemberList.push({
                user_idx: user.user_idx,
                user_name: user.user_name,
                wrm_user_color: insertedMember.wrm_user_color,
                wrm_user_ready: 0,
            });
        }
        return insertedMember;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};
