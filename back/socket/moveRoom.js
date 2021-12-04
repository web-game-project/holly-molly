const {printErrorLog, printLog} = require('../util/log');

module.exports = (io, socket, roomIdToJoin) => {
    // move Room
    const currentRoom = Array.from(socket.rooms);
    for (const roomNum of currentRoom) {
        if (roomNum == socket.id) continue;
        socket.leave(roomNum);
    }
    socket.join(roomIdToJoin);
    printLog('moveRoom', `${socket.user_idx}USER{${socket.id}, ${socket.rooms}}`);
    // send test message
    if(io){ 
        io.to(roomIdToJoin).emit('test', {roomIdToJoin, list:Array.from(socket.rooms)});
    }
};
