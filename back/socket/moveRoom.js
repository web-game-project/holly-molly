module.exports = (req, res, roomIdToLeave, roomIdToJoin) => {
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
    if(roomIdToLeave != -1) socket.leave(roomIdToLeave); //나갈 room이 없는 경우 -1
    socket.join(roomIdToJoin);
    // test message
    io.to(roomIdToJoin).emit('test', `${roomIdToJoin}를 보고 있습니다.`);
}