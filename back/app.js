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
const {
    authMiddleware,
    roomMiddleware,
    gameMiddleware,
} = require('./middleware');
//const PORT = 8080;
const PORT = 3002;

const app = express();
const server = Http.createServer(app);
socket(server, app);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('success');
});
app.use('/login', loginRouter);
app.use('/room', roomRouter);
app.use('/waiting-room', waitingRoomRouter);
app.use('/game', gameRouter);

server.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});
