const { Room, Game, GameSet, GameMember, WaitingRoomMember, KeyWord } = require('../../models');
const moveRoom = require('../../socket/moveRoom');

module.exports = async (req, res, next) => {
    try {
        const { game_idx, game_set_no } = req.body;
        
        const keyWord = await KeyWord.findOne({
            order: Sequelize.literal('RAND()'),
            limit: 1,
        });
        const beforeGameSet = await GameSet.findOne({
            where:{
                game_game_idx: game_idx,
                game_set_no: game_set_no-1.
            }
        });
        /*const gameSet = await GameSet.create({
            game_set_no: game_set_no,
            game_set_human_score: 0,
            game_set_ghost_score: 0,
            keyword_keyword_idx: keyWord.get("keyWord_idx"),
            game_game_idx: game_idx,
        });*/
        const gameMemberList = await WaitingRoomMember.fineAll({
            attributes: ['wrm_user_color', 'user_user_idx', ['GameMembers.game_member_order','game_member_order']],
            include: [{ model: GameMember, required: true, as: 'GameMembers', attributes:[] }],
            where:{
                game_game_idx: game_idx,
            }
        });
        res.json(keyWord, beforeGameSet, gameMemberList);
        // response
        /*
        {
            "before_game_set_img": "이미지url",
            "before_game_set_keyword": "음식",  
            "current_set_keyword":"동화", 
            "user-list": [{"user_idx": 1, "game_member_order": 2, "user_color": 1}, {}, {}]
        }
        */

        // socket : start set

        //res.status(200).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};
