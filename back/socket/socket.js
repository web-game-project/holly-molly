const { socketConfig } = require('../config/config');
const socketIo = require('socket.io');
const verifyJWT = require('../util/jwt/verifyJWT');
const chat = require('./chat');
const { User } = require('../models');

module.exports = (server, app) => {
    const io = socketIo(server, socketConfig);
    app.set('io', io);

    io.on('connection', async (socket) => {
        console.log("1. ",socket.id);
        console.log("2. ",socket.handshake.auth);

        try {
            const { user_idx } = verifyJWT.verifyAccessToken(socket.handshake.auth);
            console.log("3. ", user_idx);
            //db
            await User.update(
                {
                    socket_id : socket.id,
                },
                { where: { user_idx } }
            )
        } catch (error) {
            console.log("4.", error);
        }

        socket.on('error', (error) => {});
        socket.on('disconnect', () => {
            console.log('5. disconnect', socket.id);
            clearInterval(socket.interval);
        });

        socket.on('chat', chat.bind(this, socket, io));
        //socket.join(1);
        console.log(socket.rooms);
    });
};
