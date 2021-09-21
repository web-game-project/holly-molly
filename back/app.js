const express = require('express');
const Http = require('http');
const socketIo = require('socket.io');
const { socketConfig } = require('./config/config')

//const socketInit = require('./socket/socket');
const {
    loginRouter,
    roomRouter,
    waitingRoomRouter,
    gameRouter,
} = require('./router');
const PORT = 8080;

const app = express();
const server = Http.createServer(app);

//const io = socketIo(server, socketConfig);
//app.set('io', io);

app.get('/', (req, res) => {
    res.send('success!');
});
app.use(express.json());
app.use('/login', loginRouter);
app.use('/room', roomRouter);
app.use('/waiting-room', waitingRoomRouter);
app.use('/game', gameRouter);

server.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});
//socketInit(server, app, io);
