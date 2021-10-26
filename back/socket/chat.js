module.exports = async (socket, io, data) => {
    io.to(data.room_idx).emit('chat', {
        user_idx: data.user_idx,
        user_name: data.user_name,
        msg: data.msg,
    })
    /*socket.broadcast.to(data.room_idx).emit('chat', {
        user_idx: data.user_idx,
        user_name: data.user_name,
        msg: data.msg,
    });*/
};
