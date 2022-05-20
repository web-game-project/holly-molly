const { Chat, sequelize } = require('../../models');

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
    let sql = "SELECT * "
            + "FROM ("
                + "SELECT u.user_idx, u.user_name, wrm.wrm_user_color, c.chat_msg, c.created_at, c.chat_idx "
                + "FROM Chat c "
                + "JOIN WaitingRoomMember wrm ON c.room_room_idx = wrm.room_room_idx AND c.user_user_idx = wrm.user_user_idx "
                + "JOIN User u ON wrm.user_user_idx = u.user_idx "
                + `WHERE c.room_room_idx = ${roomIdx} `
                + "ORDER BY c.created_at DESC, c.chat_idx DESC "
                + "LIMIT 50"
            + ") A "
            + "ORDER BY created_at ASC, chat_idx ASC";
    console.log(sql);
    const chats = await sequelize.query(sql,
        {
            type: sequelize.QueryTypes.SELECT, 
            raw: true
        });

    return chats;
}