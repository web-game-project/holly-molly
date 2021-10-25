const { timerResolveMap, memberCountMap, acceptedMemberMap, startTimer } = require('../util/timer');

module.exports = async (socket, io, data) => {
    let { room_idx, user_idx } = data;
    if(!timerResolveMap.get(room_idx)){
        let memberCount = data.member_count;
        startTimer(io, room_idx, user_idx, memberCount);
    }
    else{
        let timerResolve = timerResolveMap.get(room_idx);
        let {memberCount, currentCount} = memberCountMap.get(room_idx);
        currentCount += 1;
        memberCountMap.set(room_idx, {memberCount, currentCount});

        let acceptedMember = acceptedMemberMap.get(room_idx);
        acceptedMember.push(user_idx);
        acceptedMemberMap.set(room_idx, acceptedMember);
        
        if(memberCount == currentCount){
            timerResolve('success');
        }
    }
};