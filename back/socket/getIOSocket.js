module.exports = (req, res) => {
    // get Socket
    const socketId = res.locals.user.socket_id;
    const io = req.app.get('io');
    const socket = io.sockets.sockets.get(socketId);
    return {io, socket};
};
