const {
    GameSet,
    GameMember,
    WaitingRoomMember,
    Keyword,
} = require('../../models');
var Sequelize = require('sequelize');

module.exports = async (req, res, next) => {
    try {
        //방장인지 체크
        
        const { game_idx, game_set_no } = req.body;

        const keyWord = await Keyword.findAll({
            order: Sequelize.literal('RAND()'),
            limit: 1,
        });

        const beforeGameSet = await GameSet.findOne({
            include: [
                {
                    model: Keyword,
                    required: true,
                    as: 'keyword_keyword_idx_Keyword',
                    attributes: ['keyword_child'],
                },
            ],
            where: {
                game_game_idx: game_idx,
                game_set_no: game_set_no - 1,
            },
        });

        const gameSet = await GameSet.create({
            game_set_no: game_set_no,
            game_set_human_score: 0,
            game_set_ghost_score: 0,
            keyword_keyword_idx: keyWord[0].get("keyWord_idx"),
            game_game_idx: game_idx,
        });

        const gameMemberList = await GameMember.findAll({
            attributes: ['game_member_order'],
            include: [
                {
                    model: WaitingRoomMember,
                    required: true,
                    as: 'wrm_wrm_idx_WaitingRoomMember',
                    attributes: [
                        'wrm_user_color',
                        'user_user_idx',
                        'room_room_idx',
                    ],
                },
            ],
            where: {
                game_game_idx: game_idx,
            },
        });

        const userList = [];
        for (const user of gameMemberList){
            userList.push({
                user_idx: user.get('wrm_wrm_idx_WaitingRoomMember').get('user_user_idx'),
                game_member_order: user.get('game_member_order'),
                user_color: user.get('wrm_wrm_idx_WaitingRoomMember').get('wrm_user_color'),
            });
        }
        const setInfo = {
            before_game_set_img: beforeGameSet.get('game_set_img'),
            before_game_set_keyword: beforeGameSet.get('keyword_keyword_idx_Keyword').get('keyword_child'),
            before_game_set_human_answer: beforeGameSet.get('game_set_human_answer'),
            user_list: userList,
        };
 
        // socket : start set
        const io = req.app.get('io');
        io.to(gameMemberList[0].get('wrm_wrm_idx_WaitingRoomMember').get('room_room_idx')).emit("start set", setInfo);
        res.status(200).json(setInfo);
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};
