const { Room, Game, GameSet, GameMember, GameVote } = require('../../models');
const moveRoom = require('../../socket/moveRoom');

module.exports = async (req, res, next) => {
    try {
        const { game_idx, game_set_no } = req.body;
        
        // 몇번째 판인지 맞게 왔는지 체크

        // 다음세트 생성

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
        
        
        res.status(200).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

