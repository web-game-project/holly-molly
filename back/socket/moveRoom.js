const {printErrorLog, printLog} = require('../util/log');

module.exports = (io, socket, roomIdToJoin) => {
    // move Room
    for (const roomNum of socket.rooms) {
        if (roomNum == socket.id) continue;
        socket.leave(roomNum);
    }
    socket.join(roomIdToJoin);

    const currentRoom = Array.from(socket.rooms);
    printLog('moveRoom', `${socket.user_idx}USER{${socket.id}, ${currentRoom}}`);
    
    // send test message
    if(io){ 
        io.to(roomIdToJoin).emit('test', {roomIdToJoin, list:currentRoom});
    }
};
