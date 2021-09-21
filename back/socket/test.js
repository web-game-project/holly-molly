async function setSocket(socket) {
    socket.on('error', (error) => {});
    socket.on('disconnect', () => {
        console.log('io-연결 해제', socket.id);
        clearInterval(socket.interval);
    });
    socket.on('test1', sendAll(io));
    socket.on('test2', sendRoom(io,"1"));
    socket.join('1');
    console.log(socket.rooms)
}
module.exports = setSocket;