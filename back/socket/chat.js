const { gameSchema } = require('../util/joi/schema');
const { Chat } = require('../models');

module.exports = async (socket, io, data) => {
    const { error, value } = gameSchema.chat.validate(data);
    let { user_color, msg } = value;

    if(error){
        io.to(socket.id).emit('error', {event: 'chat', error: error.details[0].message});
        return;
    }
    else{
        let currentRoom = -1;
        for (const roomNum of socket.rooms) {
            if (roomNum == socket.id) continue;
            currentRoom = roomNum;
        }

        io.to(currentRoom).emit('chat', {
            user_idx: socket.user_idx,
            user_name: socket.user_name,
            user_color: user_color,
            msg: msg,
        });

        await createChatMsg(msg, currentRoom, user_udx);
    }
};

const createChatMsg = async (chatMsg, userIdx, roomIdx) => {
    try {
        await Chat.create({
            chat_msg: chatMsg,
            user_user_idx: userIdx,
            room_room_idx: roomIdx,
        });
    } catch (error) {
        console.log('createChatMsg Error: ', error);
    }
};