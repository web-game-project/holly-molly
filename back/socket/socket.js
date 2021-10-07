const { socketConfig } = require('../config/config');
const socketIo = require('socket.io');
const verifyJWT = require('../util/jwt/verifyJWT');
const chat = require('./chat');
const draw = require('./draw');
const { User } = require('../models');

module.exports = (server, app) => {
    const io = socketIo(server, socketConfig);
    app.set('io', io);

    io.on('connection', async (socket) => {
        saveSocketId(socket);

        // 여기에 socket.on 추가
        socket.on('chat', chat.bind(this, socket, io));
        socket.on('draw', draw.bind(this, socket, io));

        socket.on('error', errorEvent.bind(this, socket));
        socket.on('disconnect', () => {
            clearInterval(socket.interval);
        });
        socket.use(async (event, next) => {
            let token;
            try {
                token = verifyJWT.verifyAccessToken(
                    socket.handshake.headers.auth
                );
            } catch (error) {
                return next(new Error('unauthorized event'));
            }
            const user = await User.findByPk(token.user_idx);
            if (!user) {
                return next(new Error('not user'));
            }
            next();
        });
    });
};

const saveSocketId = async (socket) => {
    try {
        const { user_idx } = verifyJWT.verifyAccessToken(
            socket.handshake.headers.auth
        ); // postman test code
        if(!user_idx){
            console.log("hey");
            const { user_idx } = verifyJWT.verifyAccessToken(socket.handshake.auth.token);
        }
        //const { user_idx } = verifyJWT.verifyAccessToken(socket.handshake.auth.token); // real code

        const user = await User.update(
            {
                socket_id: socket.id,
            },
            { where: { user_idx } }
        );

        if (user[0] == 0) {
            socket.disconnet(true);
        }
    } catch (error) {
        socket.disconnect(true);
    }
};

const errorEvent = (socket, err) => {
    console.log(err);
    const isNotAuth =
        err &&
        (err.message === 'unauthorized event' || err.message === 'not user');
    if (isNotAuth) {
        socket.emit('error', {
            message: 'auth token이 유효하지 않습니다.',
        });
        socket.disconnect(true);
    }
};
