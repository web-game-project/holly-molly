const express = require('express');
const Http = require('http');
const socket = require('./socket/socket');

const {
    loginRouter,
    roomRouter,
    waitingRoomRouter,
    gameRouter,
} = require('./router');
const { authMiddleware, roomMiddleware, gameMiddleware } = require('./middleware');
//const { authMiddleware } = require('./middleware')
const PORT = 8080;

const app = express();
const server = Http.createServer(app);
socket(server, app);

app.get('/', (req, res) => {
    res.send('success');
});
app.use(express.json());

app.get('/test1', authMiddleware, gameMiddleware, (req,res) => {
    const user = res.locals.user
    const leader = res.locals.leader
    const role = res.locals.role
    res.json({
        user:user.user_idx, leader, role
    });
} )
// gameSetIdx
app.get('/test2', authMiddleware, gameMiddleware, (req,res) => {
    const user = res.locals.user
    const leader = res.locals.leader
    const role = res.locals.role
    res.json({
        user:user.user_idx, leader, role
    });
} )
app.get('/test1/:gameIdx', authMiddleware, gameMiddleware, (req,res) => {
    const user = res.locals.user
    const leader = res.locals.leader
    const role = res.locals.role
    res.json({
        user:user.user_idx, leader, role
    });
} )
app.get('/test2/:gameSetIdx', authMiddleware, gameMiddleware, (req,res) => {
    const user = res.locals.user
    const leader = res.locals.leader
    const role = res.locals.role
    res.json({
        user:user.user_idx, leader, role
    });
} )

app.use('/login', loginRouter);
app.use('/room', roomRouter);
app.use('/waiting-room', waitingRoomRouter);
app.use('/game', gameRouter);

server.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});
