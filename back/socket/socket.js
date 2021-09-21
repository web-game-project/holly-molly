const { socketConfig } = require('../config/config');
const socketIo = require('socket.io');

async function sendAll(socket, io, event, message) {
    io.emit(event, message);
}
async function sendRoom(socket, io, event, message, data) {  
    io.to(data).emit(event, message);
}

module.exports = (server, app) => {
    const io = socketIo(server, socketConfig);
    app.set('io', io);

    io.on('connection', (socket) => {
        console.log(socket.id);

        socket.on('error', (error) => {});
        socket.on('disconnect', () => {
            console.log('io-연결 해제', socket.id);
            clearInterval(socket.interval);
        });

        socket.on('event1', sendAll.bind(this, socket, io, "socket-js" ,'event1에 대한 message'));
        socket.on('event2', sendRoom.bind(this, socket, io, "socket-js1", 'event2에 대한 message'));
        socket.on('event3', sendRoom.bind(this, socket, io, "socket-js2",'event3에 대한 message'));

        socket.join('1');
        console.log(socket.rooms);
    });
};
