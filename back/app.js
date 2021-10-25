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
app.use('/login', loginRouter);
app.use('/room', authMiddleware, roomRouter);
app.use('/waiting-room', authMiddleware, waitingRoomRouter);
app.use('/game', authMiddleware, gameRouter);

server.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});
