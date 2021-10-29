const {
    GameSet,
    GameMember,
    WaitingRoomMember,
    Keyword,
} = require('../../models');
var Sequelize = require('sequelize');
var fs = require('fs');
const shuffleList = require('../../util/shuffleList');

module.exports = async (req, res, next) => {
    try {
       
        if(!res.locals.leader){
            res.status(403).json({
                message: "방장이 아닙니다."
            });
            return;
        }
        
        const { game_idx, game_set_no } = req.body;

        const keyword = await getKeyword();
        const beforeGameSet = await getGameSet(game_idx, game_set_no-1);
        const currentGameSet = await creageGameSet(game_set_no, keyword[0].get("keyword_idx"), game_idx);
        const gameMemberList = await getGameMemberList(game_idx);
        const orderList = await updateGameOrder(gameMemberList);

        // make socket data
        const userList = [];
        for (const i in gameMemberList){
            userList.push({
                user_idx: gameMemberList[i].get('wrm_wrm_idx_WaitingRoomMember').get('user_user_idx'),
                game_member_order: orderList[i],
                user_color: gameMemberList[i].get('wrm_wrm_idx_WaitingRoomMember').get('wrm_user_color'),
            });
        }

        const beforeSetImg = getImageSync(`./image/${beforeGameSet.get('game_set_img')}`);
        const setInfo = {
            before_game_set_img: (beforeSetImg) ? "data:image/png;base64,"+ beforeSetImg : null,
            before_game_set_keyword: beforeGameSet.get('keyword_keyword_idx_Keyword').get('keyword_child'),
            before_game_set_human_answer: beforeGameSet.get('game_set_human_answer'),
            current_game_set_idx: currentGameSet.get('game_set_idx'),
            user_list: userList,
        };
     
        // socket : start set
        const io = req.app.get('io');
        io.to(gameMemberList[0].get('wrm_wrm_idx_WaitingRoomMember').get('room_room_idx')).emit("start set", setInfo);
        res.status(201).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

const getKeyword = async () => {
    return await Keyword.findAll({
        order: Sequelize.literal('RAND()'),
        limit: 1,
    });
}

const getGameSet = async(gameIdx, gameSetNo) => {
    return await GameSet.findOne({
        include: [
            {
                model: Keyword,
                required: true,
                as: 'keyword_keyword_idx_Keyword',
                attributes: ['keyword_child'],
            },
        ],
        where: {
            game_game_idx: gameIdx,
            game_set_no: gameSetNo,
        },
    });
} 

const creageGameSet = async(gameSetNo, keywordIdx, gameIdx) => {
    const gameSet = await GameSet.findOne({
        where:{
            game_game_idx: gameIdx, 
            game_set_no: gameSetNo,
        }
    });
    if(!gameSet){
        await GameSet.create({
            game_set_no: gameSetNo,
            game_set_human_score: 0,
            game_set_ghost_score: 0,
            keyword_keyword_idx: keywordIdx,
            game_game_idx: gameIdx,
        });
    }
    return gameSet;
}

const getGameMemberList = async(gameIdx) => {
    return await GameMember.findAll({
        attributes: ['game_member_idx','game_member_order'],
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
            game_game_idx: gameIdx,
        },
    });
}
const updateGameOrder = async(gameMemberList) => {
    const orderList = [];
    for (const i in gameMemberList){
        orderList.push(Number(i)+1);
    }
    shuffleList(gameMemberList);

    for(const i in gameMemberList){
        await GameMember.update({
            game_member_order: orderList[i]
        },{
            where:{
                game_member_idx: gameMemberList[i].get('game_member_idx'),
            }
        });
    }
    return orderList;
}

const getImageSync = (imageLocation) => {
    try {
        const image = fs.readFileSync(imageLocation);
        return image.toString("base64");
    } catch (error) {
        return undefined;
    }
}