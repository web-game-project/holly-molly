let memberCountMap = new Map();
let timerResolveMap = new Map();

module.exports.timerResolveMap = timerResolveMap;
module.exports.memberCountMap = memberCountMap;

module.exports.startTimer = async (io, roomIdx, memberCount) => {
    let timer;
    memberCountMap.set(roomIdx, {memberCount, currentCount: 1});
    let promise = new Promise((resolve, reject) => {
        timer = setTimeout(() => resolve('time out'), 3*1000);
        timerResolveMap.set(roomIdx, resolve);
    });
    let result = await promise;
    clearTimeout(timer);
    timerResolveMap.delete(roomIdx);
    if(result == 'success')
        io.to(roomIdx).emit('get next turn', {"message": "success"}); 
};