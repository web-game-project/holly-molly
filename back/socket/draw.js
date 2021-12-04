const { gameSchema } = require('../util/joi/schema');

module.exports = async (socket, io, data) => {
    const { error, value } = gameSchema.draw.validate(data);
    let { room_idx, draw_info } = value;

    if(error){
        let socketId = socket.id;

        io.to(socketId).emit('draw', {error: error.details[0].message});

        return;
    }
    else{
        io.to(room_idx).emit('draw', draw_info);
    }
};
