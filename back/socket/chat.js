module.exports = async (socket, io, data) => {
    // 관련 로직 처리
    
    console.log(data.room_idx, data.user_name)
    io.to(data.room_idx).emit("chat", data.user_name);
};