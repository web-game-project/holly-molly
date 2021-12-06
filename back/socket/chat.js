const { gameSchema } = require('../util/joi/schema');

module.exports = async (socket, io, data) => {
    const { error, value } = gameSchema.chat.validate(data);
    let { msg } = value;

    if(error){
        io.to(socket.id).emit('error', {event: 'chat', error: error.details[0].message});
        return;
    }
    else{
        const socketRooms = Array.from(socket.rooms);
        let currentRoom;
        for (const roomNum of socketRooms) {
            if (roomNum == socket.id) continue;
            currentRoom = roomNum;
        }

        io.to(currentRoom).emit('chat', {
            user_idx: socket.user_idx,
            user_name: socket.user_name,
            msg: msg,
        });
    }
};
