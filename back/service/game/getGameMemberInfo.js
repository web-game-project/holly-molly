const { Keyword } = require('../../models');
const { GameSet } = require('../../models');
const { GameMember } = require('../../models');

/*module.exports = async (req, res, next) => {
    let { gameIdx } = req.params;
    let userIdx = 3;

    try {
        let userRole = getUserRole(gameIdx, userIdx);
        let keyword = getKeyword(gameIdx, userRole);

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

        let { game_member_role } = member.dataValues;
        let userRole = "ghost";

        if(game_member_role == 1)
            userRole = "human";

        return userRole;
    } catch (error) {
        console.log('getUserRole Error: ', error);
    }
}

const getKeyword = async (gameIdx, userRole) => {
    try {
        const keyword = await GameSet.findOne({
            attributes: [
                'keyword_parent', 'keyword_child'
            ],
            include: [
                {
                  model: Keyword
                }
            ],
            where: {
                game_game_idx: gameIdx
            }
        });

        let { keyword_parent, keyword_child } = keyword.dataValues;

        if(userRole == "human")
            return keyword_parent;
        else
            return keyword_child;

        return userRole;
    } catch (error) {
        console.log('getUserRole Error: ', error);
    }
}*/