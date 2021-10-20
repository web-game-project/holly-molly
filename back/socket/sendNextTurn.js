const { timerResolveMap, memberCountMap, startTimer } = require('../util/timer');

module.exports = async (socket, io, data) => {
    let roomIdx = data.room_idx;
    if(!timerResolveMap.get(roomIdx)){
        let memberCount = data.member_count;
        startTimer(io, roomIdx, memberCount);
    }
    else{
        let timerResolve = timerResolveMap.get(roomIdx);
        let {memberCount, currentCount} = memberCountMap.get(roomIdx);
        currentCount += 1;
        memberCountMap.set(roomIdx, {memberCount, currentCount});
        
        if(memberCount == currentCount){
            timerResolve('success');
        }
    }
};