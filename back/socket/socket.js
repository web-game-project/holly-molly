const { socketConfig } = require('../config/config');
const socketIo = require('socket.io');
const verifyJWT = require('../util/jwt/verifyJWT');
const chat = require('./chat');
const { User } = require('../models');

module.exports = (server, app) => {
    const io = socketIo(server, socketConfig);
    app.set('io', io);

    io.on('connection', async (socket) => {
        try {
            const { user_idx } = verifyJWT.verifyAccessToken(socket.handshake.headers.auth); // postman test code
            //const { user_idx } = verifyJWT.verifyAccessToken(socket.handshake.auth.token); // real code
            
            await User.update(
                {
                    socket_id : socket.id,
                },
                { where: { user_idx } }
            )

            /* 대기실 리스트 조회 api로 이동 예정
            if(socket.handshake.headers.path == 'roomlist'){
                socket.join(0); 
                //console.log(io.sockets.adapter.rooms);
            }*/
        } catch (error) {
            socket.emit("error", {message:"auth token이 유효하지 않습니다."}); 
            socket.disconnect(true);
        }

        socket.on('error', (error) => {});
        socket.on('disconnect', () => {
            clearInterval(socket.interval);
        });
        socket.on('chat', chat.bind(this, socket, io));
    });
};
