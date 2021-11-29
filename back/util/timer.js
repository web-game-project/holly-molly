let memberCountMap = new Map();
let timerResolveMap = new Map();
let acceptedMemberMap = new Map();
const { User, WaitingRoomMember, GameMember, sequelize } = require('../models');
const { exitGameAndRoom, deleteUser } = require('../service/game/exitGame') 

module.exports.timerResolveMap = timerResolveMap;
module.exports.memberCountMap = memberCountMap;
module.exports.acceptedMemberMap = acceptedMemberMap;

module.exports.startTimer = async (io, room_idx, user_idx, member_count, draw_order) => {
    let timer;
    memberCountMap.set(room_idx, { member_count, currentCount: 1 });
    acceptedMemberMap.set(room_idx, [user_idx]);

    let promise;

    // 새로운 세트가 시작될 때(게임 시작도 포함) 모든 사용자가 준비가 된 후 게임 시작
    if(draw_order == 1){
        promise = new Promise((resolve, reject) => {
            timer = setTimeout(() => resolve('time out'), 10 * 1000);
            timerResolveMap.set(room_idx, resolve);
        });
    }
    else {
        promise = new Promise((resolve, reject) => {
            timer = setTimeout(() => resolve('time out'), 3 * 1000);
            timerResolveMap.set(room_idx, resolve);
        });
    }
    let result = await promise;
    clearTimeout(timer);
    timerResolveMap.delete(room_idx);
    memberCountMap.delete(room_idx);

    io.to(room_idx).emit('get next turn', { data: 'success' });
    
    if (result == 'time out') {
        exitGameAndRoomAndDeleteUser(io, room_idx, acceptedMemberMap.get(room_idx));
        acceptedMemberMap.delete(room_idx);
    }
};

const exitGameAndRoomAndDeleteUser = async (io, room_idx, acceptedMember) => {
    let query = "SELECT WaitingRoomMember.user_user_idx "
              + "FROM WaitingRoomMember "
              + "JOIN GameMember on WaitingRoomMember.wrm_idx = GameMember.wrm_wrm_idx "
              + `where WaitingRoomMember.room_room_idx=${room_idx} and WaitingRoomMember.user_user_idx not in (`;

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
        deleteUser(user_user_idx);
    }
};