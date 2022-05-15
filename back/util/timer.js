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
    else { // 처음 순서가 아니고, 다음 순서로 넘어갈 땐 3초
        promise = new Promise((resolve, reject) => {
            timer = setTimeout(() => resolve('time out'), 3 * 1000);
            timerResolveMap.set(room_idx, resolve);
        });
    }
    let result = await promise;
    clearTimeout(timer);
    timerResolveMap.delete(room_idx);
    memberCountMap.delete(room_idx);

    console.log('timer result');
    console.log(result);
    io.to(room_idx).emit('get next turn', { data: 'success' });
    
    if (result == 'time out') {
        exitGameAndRoomAndDeleteUser(io, room_idx, acceptedMemberMap.get(room_idx));
        acceptedMemberMap.delete(room_idx);
    }
};

const exitGameAndRoomAndDeleteUser = async (io, room_idx, acceptedMember) => {
    let query = "SELECT wrm.user_user_idx as user_idx, u.user_name "
              + "FROM WaitingRoomMember wrm "
              + "JOIN GameMember gm on wrm.wrm_idx = gm.wrm_wrm_idx "
              + "JOIN User u on wrm.user_user_idx = u.user_idx "
              + `where wrm.room_room_idx=${room_idx} and wrm.user_user_idx not in (`;

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
        let user = NotAcceptedMembers[i];
        console.log("timer exit: " + user);
        const isSuccess = await exitGameAndRoom(user, io);
        if(!isSuccess)  throw "exitGame fail";
        deleteUser(user.user_idx);
    }
};