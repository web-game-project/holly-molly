let memberCountMap = new Map();
let timerResolveMap = new Map();
let acceptedMemberMap = new Map();
const { User, WaitingRoomMember, GameMember } = require('../models');
const sequelize = require('sequelize');
const { exitGameAndRoom, deleteUser } = require('../service/game') 

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
        exitGameAndRoomAndDeleteUser(io, roomIdx, acceptedMemberMap.get(roomIdx));
        acceptedMemberMap.delete(roomIdx);
    }
};

const exitGameAndRoomAndDeleteUser = async (io, roomIdx, acceptedMember) => {
    let query = "SELECT WaitingRoomMember.user_user_idx "
              + "FROM WaitingRoomMember "
              + "JOIN GameMember on WaitingRoomMember.wrm_idx = GameMember.wrm_wrm_idx "
              + `where WaitingRoomMember.room_room_idx=${roomIdx} and WaitingRoomMember.user_user_idx not in (`;

    for(let i in acceptedMember){
        if(i == acceptedMember.length - 1)
            query += acceptedMember[i];
        else
            query += acceptedMember[i] + ', ';
    }

    query += ')';

    const NotAcceptedMembers = await sequelize.query(query,
        {
            type: sequelize.QueryTypes.SELECT, 
            raw: true
        });

    for(let i in NotAcceptedMembers){
        let { user_user_idx } = NotAcceptedMembers[i];
        const isSuccess = await exitGameAndRoom({user_idx: user_user_idx}, io);
        if(!isSuccess)  throw "exitGame fail";
        await deleteUser(user_user_idx);
    }
};