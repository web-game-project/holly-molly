let memberCountMap = new Map();
let timerResolveMap = new Map();
let acceptedMemberMap = new Map();
const { User, WaitingRoomMember, GameMember } = require('../models');
const sequelize = require('sequelize');

module.exports.timerResolveMap = timerResolveMap;
module.exports.memberCountMap = memberCountMap;
module.exports.acceptedMemberMap = acceptedMemberMap;

module.exports.startTimer = async (io, roomIdx, user_idx, memberCount) => {
    let timer;
    memberCountMap.set(roomIdx, { memberCount, currentCount: 1 });
    acceptedMemberMap.set(roomIdx, [user_idx]);
    let promise = new Promise((resolve, reject) => {
        timer = setTimeout(() => resolve('time out'), 5 * 1000);
        timerResolveMap.set(roomIdx, resolve);
    });
    let result = await promise;
    console.log(result);
    clearTimeout(timer);
    timerResolveMap.delete(roomIdx);
    memberCountMap.delete(roomIdx);
    
    io.to(roomIdx).emit('get next turn', { message: 'success' });
    
    if (result == 'time out') {
        exitGame(io, roomIdx, acceptedMemberMap.get(roomIdx));
        acceptedMemberMap.delete(roomIdx);
    }
};

const exitGame = async (io, roomIdx, acceptedMember) => {
    const roomInfo = await WaitingRoomMember.findAll({
        attributes: ['wrm_idx', 'user_user_idx'],
        where: {
            room_room_idx: roomIdx,
            user_user_idx: { [sequelize.Op.notIn] : acceptedMember }
        }
    });

    let wrmIdxList = [];
    let notAcceptedMember = [];

    for(let i in roomInfo){
        let { wrm_idx, user_user_idx } = roomInfo[i].dataValues;
        wrmIdxList.push(wrm_idx);
        notAcceptedMember.push(user_user_idx);
        io.emit('change member count', member_data);
    }

    let memberCount = getMemberCount(roomIdx);
    let member_data = { room_idx: roomIdx, room_member_count: memberCount };
    io.emit('change member count', member_data);

    console.log(roomInfo);
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