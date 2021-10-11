module.exports = async (socket, io, data) => {
    io.to(data.room_idx).emit('draw', data.draw_info);
};
