module.exports = (req, res, roomIdToJoin) => {
    // get Socket
    const socketId = res.locals.user.socket_id;
    const io = req.app.get('io');
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
        res.status(400).json({
            message: 'socket connection을 다시 해주세요.',
        });
        return;
    }
    // move Room
    const currentRoom = Array.from(socket.rooms);
    for (const roomNum of currentRoom) {
        if (roomNum == socketId) continue;
        socket.leave(roomNum);
    }
    socket.join(roomIdToJoin);
    // test message
    io.to(roomIdToJoin).emit('test', {roomIdToJoin, list:Array.from(socket.rooms)});
};
