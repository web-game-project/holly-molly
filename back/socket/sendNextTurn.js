const { timerResolveMap, memberCountMap, acceptedMemberMap, startTimer } = require('../util/timer');
const { WaitingRoomMember, sequelize } = require('../models');

module.exports = async (socket, io, data) => {
    let { room_idx, user_idx, draw_order } = data;
    console.log("get next turn");
    console.log(`user_idx: ${user_idx}, room_idx: ${room_idx}, draw_order: ${draw_order}`);
    
    //let room_idx = [...socket.rooms.keys()[1]]; //socket에서 room 가져오기

    let roomMember = await checkWaitingRoom(room_idx, user_idx);
    let socketId = socket.id;

    if(!roomMember) {
        io.to(socketId).emit('get next turn', {data: '', error: '대기실/게임의 참여자가 아닙니다.'});
        return;
    }

    if(!timerResolveMap.get(room_idx)){
        let { member_count } = data;
        startTimer(io, room_idx, user_idx, member_count, draw_order);
    }
    else{
        let timerResolve = timerResolveMap.get(room_idx);
        let {member_count, currentCount} = memberCountMap.get(room_idx);
        currentCount += 1;
        memberCountMap.set(room_idx, {member_count, currentCount});

        let acceptedMember = acceptedMemberMap.get(room_idx);
        acceptedMember.push(user_idx);
        acceptedMemberMap.set(room_idx, acceptedMember);
        
        if(member_count == currentCount){
            timerResolve('success');
        }
    }
};

const checkWaitingRoom = async (room_idx, user_idx) => {
    const roomMember = await WaitingRoomMember.findOne({
        where: {
            room_room_idx: room_idx,
            user_user_idx: user_idx,
        },
    });

    return roomMember;
};