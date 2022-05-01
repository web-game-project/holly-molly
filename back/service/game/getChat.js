const { Chat } = require('../../models');

module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;

    try {
        let chats = await getGameChat(roomIdx);

        res.status(200).json(chats);
    } catch (error) {
        console.log('getChat Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const getGameChat = async (roomIdx) => {
    const chats = await Chat.findAll({
        where: { room_room_idx: roomIdx }, 
        limit: 50, 
        order: [["created_at", "DESC"]]
    });

    return chats;
}