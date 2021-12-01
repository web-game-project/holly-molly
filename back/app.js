const express = require('express');
const Http = require('http');
const socket = require('./socket/socket');
const cors = require('cors');

const {
    loginRouter,
    roomRouter,
    waitingRoomRouter,
    gameRouter,
} = require('./router');
const { authMiddleware } = require('./middleware');
//const PORT = 8080;
const PORT = 3002;

const app = express();
app.use(cors());
app.use(express.json());
const server = Http.createServer(app);
socket(server, app);

app.get('/', (req, res) => {
    res.send('success');
});
app.get('/socketTest', (req, res) => {
    const io = req.app.get('io');
    const socketIdList = Array.from(io.sockets.sockets.keys());
    const socketRoomSet = new Map();
    for(let socketId of socketIdList){
        let tempSocket = io.sockets.sockets.get(socketId);
        let tempUserIdx = io.sockets.sockets.get(socketId).user_idx;
        socketRoomSet.set(socketId, {tempUserIdx:tempUserIdx+"번", room:Array.from(tempSocket.rooms)});
    }
    res.send({socketList: Array.from(socketRoomSet)});
})
app.use('/login', loginRouter);
app.use('/room', authMiddleware, roomRouter);
app.use('/waiting-room', authMiddleware, waitingRoomRouter);
app.use('/game', authMiddleware, gameRouter);

server.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});
