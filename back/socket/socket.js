const { socketConfig } = require('../config/config');
const socketIo = require('socket.io');
const chat = require('./chat');

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

        socket.on('chat', chat.bind(this, socket, io));

        socket.join(1);
        console.log(socket.rooms);
    });
};
