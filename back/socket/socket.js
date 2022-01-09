const { socketConfig } = require('../config/config');
const socketIo = require('socket.io');
const verifyJWT = require('../util/jwt/verifyJWT');
const chat = require('./chat');
const draw = require('./draw');
const sendNextTurn = require('./sendNextTurn');
const { User, WaitingRoomMember } = require('../models');
const {printErrorLog, printLog} = require('../util/log');
var fs = require('fs');

module.exports = (server, app) => {
    const io = socketIo(server, socketConfig);
    app.set('io', io);

    io.on('connection', async (socket) => {
        saveSocketId(socket);

        // 여기에 socket.on 추가
        socket.on('chat', chat.bind(this, socket, io));
        socket.on('draw', draw.bind(this, socket, io));
        socket.on('send next turn', sendNextTurn.bind(this, socket, io));

        socket.on('error', errorEvent.bind(this, socket));
        socket.on('disconnect', () => {
            clearInterval(socket.interval);
        });
        socket.use(async(event, next) => {
            let token;
            try {
                try {
                    token = verifyJWT.decode(
                        socket.handshake.headers.auth
                    );
                } catch (error) {
                    token = verifyJWT.decode(
                        socket.handshake.auth.token
                    );
                }
            } catch (error) {
                printErrorLog('socket-socketUse', error);
                return next(new Error('unauthorized event'));
            }
            
            next();
        });
    });
};

const saveSocketId = async (socket) => {
    try {
        let tokenValue;
        try {
            // postman test code
            tokenValue = verifyJWT.verifyAccessToken(
                socket.handshake.headers.auth
            );
        } catch (error) {
            tokenValue = verifyJWT.verifyAccessToken(
                socket.handshake.auth.token
            ); // real code
        }

        const user = await User.update(
            {
                socket_id: socket.id,
            },
            { where: { user_idx: tokenValue.user_idx } }
        );
        
        socket.user_idx = tokenValue.user_idx;
        socket.user_name = tokenValue.user_name;
        
        // Join to room based on db
        const roomMember = await WaitingRoomMember.findOne({
            attribute: ['room_room_idx'],
            where: {
                user_user_idx: tokenValue.user_idx,
            }
        });
        if(roomMember){
            socket.join(roomMember.get('room_room_idx'));
            printLog('socket', `${tokenValue.user_idx}USER{${socket.id}, ${roomMember.get('room_room_idx')}방}`);
        }else{
            socket.join(0);
            printLog('socket', `${tokenValue.user_idx}USER{${socket.id}, 대기실 리스트}`);
        }
    } catch (error) {
        printErrorLog('socket-saveSocketId', error);
        socket.disconnect(true);
    }
};

const errorEvent = (socket, err) => {
    printErrorLog('socket-errorEvent', err);
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
