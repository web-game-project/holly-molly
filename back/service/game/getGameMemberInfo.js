const { Keyword, sequelize } = require('../../models');
const { GameSet } = require('../../models');
const { GameMember } = require('../../models');

module.exports = async (req, res, next) => {
    let { gameIdx } = req.params;
    let userIdx = 4;

    try {
        let userRole = await getUserRole(gameIdx, userIdx);
        let keyword = await getKeyword(gameIdx, userRole);

        res.status(200).json({keyword, user_role: userRole});
    } catch (error) {
        console.log('getGameMemberInfo Error: ', error);
    }
};

const getUserRole = async (gameIdx, userIdx) => {
    try {
        const member = await GameMember.findOne({
            attributes: [
                'game_member_role'
            ],
            where: {
                game_game_idx: gameIdx,
                wrm_user_idx: userIdx
            }
        });

        let userRole = "ghost";
        let { game_member_role } = member.dataValues;

        if(game_member_role == 1)
            userRole = "human";

        return userRole;
    } catch (error) {
        console.log('getUserRole Error: ', error);
    }
}

const getKeyword = async (gameIdx, userRole) => {
    try {
        let query = "SELECT Keyword.keyword_parent, Keyword.keyword_child "
                  + "FROM Keyword "
                  + "JOIN GameSet on Keyword.keyword_idx = GameSet.keyword_keyword_idx "
                  + `WHERE GameSet.game_game_idx = ${gameIdx} and game_set_no = 1 `;

        const keyword = await sequelize.query(query,
            {
                type: sequelize.QueryTypes.SELECT, 
                raw: true
            });

        /*const keyword = await Keyword.findOne({
            attributes: [
                'keyword_parent', 'keyword_child'
            ],
            include: [
                {
                  model: GameSet,
                  as: "GameSets"
                },
                where: {
                    game_game_idx: gameIdx
                }
            ]
        });*/

        let { keyword_parent, keyword_child } = keyword[0];

        if(userRole == "human")
            return keyword_parent;
        else
            return keyword_child;
    } catch (error) {
        console.log('getUserRole Error: ', error);
    }
}