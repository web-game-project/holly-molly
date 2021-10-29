const { Keyword, sequelize } = require('../../models');
const { GameSet } = require('../../models');
const { GameMember } = require('../../models');

module.exports = async (req, res, next) => {
    let { gameSetIdx } = req.query;
    let gameIdx = res.locals.gameIdx;
    let { user_idx } = res.locals.user.dataValues;

    try {
        let userRole = await getUserRole(gameIdx, user_idx);
        let keyword = await getKeyword(gameSetIdx, userRole);

        res.status(200).json({keyword, user_role: userRole});
    } catch (error) {
        console.log('getGameMemberInfo Error: ', error);
    }
};

const getUserRole = async (gameIdx, user_idx) => {
    try {
        const member = await GameMember.findOne({
            attributes: [
                'game_member_role'
            ],
            where: {
                game_game_idx: gameIdx,
                wrm_user_idx: user_idx
            }
        });

        return member.dataValues.game_member_role;
    } catch (error) {
        console.log('getUserRole Error: ', error);
    }
}

const getKeyword = async (gameSetIdx, userRole) => {
    try {
        let query = "SELECT Room.room_mode, Keyword.keyword_parent, Keyword.keyword_child  "
                  + "FROM Keyword "
                  + "JOIN GameSet on Keyword.keyword_idx = GameSet.keyword_keyword_idx "
                  + "JOIN Game on GameSet.game_game_idx = Game.game_idx "
                  + "JOIN Room on Game.room_room_idx = Room.room_idx "
                  + `WHERE GameSet.game_set_idx = ${gameSetIdx} `;

        const keyword = await sequelize.query(query,
            {
                type: sequelize.QueryTypes.SELECT, 
                raw: true
            });

        let { keyword_parent, keyword_child, room_mode } = keyword[0];

        if(userRole == "human"){
            if(room_mode == "easy")
                return keyword_parent;
            else
                return "";
        }
        else 
            return keyword_child;
    } catch (error) {
        console.log('getKeyword Error: ', error);
    }
}