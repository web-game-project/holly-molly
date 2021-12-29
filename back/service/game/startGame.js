const { Game, Keyword, Room, WaitingRoomMember, sequelize, GameMember, GameSet } = require('../../models');
const { gameSchema } = require('../../util/joi/schema');

module.exports.startGame = async (req, res, next) => {
    const { error, value } = gameSchema.startGame.validate(req.body);
    let { room_idx } = value;
    if(error){
        res.status(400).json({
            error: error.details[0].message
        });

        return;
    }

    try {
        if (!res.locals.leader) {
            res.status(403).json({
                message: '권한이 없습니다.',
            });
            return;
        }

        if(!await isFullMember(room_idx)){
            res.status(403).json({
                message: '플레이어의 수가 맞지 않습니다.',
            });
            return;
        }

        if(!await isAllReady(room_idx)){
            res.status(403).json({
                message: '준비되지 않은 사용자가 있습니다.',
            });
            return;
        }
        
        const io = req.app.get('io');
        await changeGameStatus(io, room_idx);

        let exist_game_idx = await isExistGame(room_idx);
        let data = {};
        if(exist_game_idx){
            let user_list = await getExistGameMember(exist_game_idx);
            let game_set_idx = await getExistGameSetIdx(exist_game_idx);
            data = {game_idx: exist_game_idx, game_set_idx, user_list};
        }
        else{
            let { game_idx } = await createAndGetGameInfo(room_idx);
            let { keyword_idx } = await getKeywordIdx();
            let { game_set_idx } = await createAndGetGameSetInfo(
                keyword_idx,
                game_idx
            );
            let memberIdxList = await getMemberIdxInfo(room_idx);
            let memberCount = await getMemberCountInfo(room_idx);
            let { roleList, orderList } = getRoleAndOrder(memberCount);
    
            let user_list = await assignRoleAndOrder(
                game_idx,
                roleList,
                orderList,
                memberIdxList,
                memberCount
            );
    
            data = {game_idx, game_set_idx, user_list};
        }
        
        io.to(room_idx).emit('start game', data);
        
        res.status(200).end();
    } catch (error) {
        console.log('startGame Error: ', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const isAllReady = async (roomIdx) => {
    const notReady = await WaitingRoomMember.findAll(
        {
            attributes: [
                'wrm_idx'
            ],
            where: { wrm_leader: 0, wrm_user_ready: 0, room_room_idx: roomIdx}
        },
    );

    console.log(notReady);

    if(notReady.length > 0)
        return false;
    else
        return true;
};

const isFullMember = async (roomIdx) => {
    let sql = "SELECT Room.room_start_member_cnt, count(WaitingRoomMember.wrm_idx) as memberCnt "
            + "FROM WaitingRoomMember "
            + "JOIN Room ON WaitingRoomMember.room_room_idx = Room.room_idx "
            + `where WaitingRoomMember.room_room_idx = ${roomIdx} `;
    const fullMember = await sequelize.query(sql,
        {
            type: sequelize.QueryTypes.SELECT, 
            raw: true
        });

    console.log(fullMember[0].room_start_member_cnt);
    console.log(fullMember[0].memberCnt);

    if(fullMember[0].room_start_member_cnt == fullMember[0].memberCnt)
        return true;
    else
        return false;
}

const isExistGame = async (roomIdx) => {
    const existGame = await Game.findOne(
        {
            attributes: [
                'game_idx',
            ],
            where: { room_room_idx: roomIdx },
            order: [["game_idx", "DESC"]]
        },
    );

    if(existGame)
        return existGame.dataValues.game_idx;
    else    
        return 0;
};

const getExistGameSetIdx = async (game_idx) => {
    const existGameSet = await GameSet.findOne(
        {
            attributes: [
                'game_set_idx',
            ],
            where: { game_game_idx: game_idx },
            order: [["game_set_idx", "DESC"]]
        },
    );

    if(existGameSet)
        return existGameSet.dataValues.game_set_idx;
    else    
        return 0;
};

const getExistGameMember = async (game_idx) => {
    let sql = "SELECT gm.wrm_user_idx as user_idx, User.user_name, gm.game_member_order, wrm.wrm_user_color as user_color "
            + "FROM Game "
            + "JOIN GameMember as gm ON Game.game_idx = gm.game_game_idx "
            + "JOIN WaitingRoomMember as wrm ON gm.wrm_wrm_idx = wrm.wrm_idx "
            + "JOIN User ON gm.wrm_user_idx = User.user_idx "
            + `WHERE Game.game_idx = ${game_idx}`;
    const gameMember = await sequelize.query(sql,
        {
            type: sequelize.QueryTypes.SELECT, 
            raw: true
        });

    return gameMember;
}

const changeGameStatus = async (io, roomIdx) => {
    Room.update(
        {
            room_status: 'playing',
        },
        { where: { room_idx: roomIdx } }
    );

    io.to(0).emit('change game status', {
        room_idx: roomIdx,
        room_status: 'playing',
    });
};

const createAndGetGameInfo = async (roomIdx) => {
    try {
        const game = await Game.create({
            room_room_idx: roomIdx,
        });

        return game.dataValues;
    } catch (error) {
        console.log('createGameInfo Error: ', error);
    }
};

const createAndGetGameSetInfo = async (keywordIdx, gameIdx) => {
    try {
        const gameSet = await GameSet.create({
            game_set_no: 1,
            keyword_keyword_idx: keywordIdx,
            game_game_idx: gameIdx,
        });

        return gameSet.dataValues;
    } catch (error) {
        console.log('createAndGetGameSetInfo Error: ', error);
    }
};

const getKeywordIdx = async () => {
    try {
        const keyword = await Keyword.findOne({
            attributes: ['keyword_idx'],
            order: sequelize.literal('rand()'),
        });

        return keyword.dataValues;
    } catch (error) {
        console.log('getKeyword Error: ', error);
    }
};

const getMemberCountInfo = async (roomIdx) => {
    try {
        const member = await WaitingRoomMember.findAll({
            attributes: [
                [
                    sequelize.fn('count', sequelize.col('wrm_idx')),
                    'memberCount',
                ],
            ],
            where: {
                room_room_idx: roomIdx,
            },
        });

        let { memberCount } = member[0].dataValues;

        return memberCount;
    } catch (error) {
        console.log('getMemberCountInfo Error: ', error);
    }
};

const getMemberIdxInfo = async (roomIdx) => {
    try {
        let sql = "SELECT wrm.wrm_idx, wrm.wrm_user_color, wrm.user_user_idx, User.user_name "
                  + "FROM WaitingRoomMember as wrm "
                  + "JOIN User on wrm.user_user_idx = User.user_idx "
                  + `WHERE wrm.room_room_idx = ${roomIdx}`;

        const member = await sequelize.query(sql,
            {
                type: sequelize.QueryTypes.SELECT, 
                raw: true
            });

        let memberIdxList = [];
        for (let i = 0; i < member.length; i++) {
            let wrm_idx = member[i].wrm_idx;
            let user_user_idx = member[i].user_user_idx;
            let wrm_user_color = member[i].wrm_user_color;
            let user_name = member[i].user_name;
            memberIdxList.push({ wrm_idx, user_user_idx, user_name, wrm_user_color });
        }

        return memberIdxList;
    } catch (error) {
        console.log('getMemberIdxInfo Error: ', error);
    }
};

const shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
};

const getRoleAndOrder = (memberCount) => {
    let roleList = [];
    let orderList = [];
    let random_idx = Math.floor(Math.random() * memberCount) + 1;

    for (let i = 1; i <= memberCount; i++) {
        if (i == random_idx) roleList.push('human');
        //"citizen"
        else roleList.push('ghost'); //"ghost"
        orderList.push(i);
    }

    shuffle(orderList);

    return { roleList, orderList };
};

const assignRoleAndOrder = async (
    gameIdx,
    roleList,
    orderList,
    memberIdxList,
    memberCount
) => {
    let memberInfoList = [];

    try {
        for (let i = 0; i < memberCount; i++) {
            let wrm_wrm_idx = memberIdxList[i].wrm_idx;
            let wrm_user_idx = memberIdxList[i].user_user_idx;
            let user_color = memberIdxList[i].wrm_user_color;
            let user_name = memberIdxList[i].user_name;
            memberInfoList.push({
                user_idx: wrm_user_idx,
                game_member_order: orderList[i],
                user_color,
                user_name
            });

            await GameMember.create({
                game_member_order: orderList[i],
                game_member_role: roleList[i],
                game_game_idx: gameIdx,
                wrm_wrm_idx,
                wrm_user_idx,
            });
        }

        return memberInfoList;
    } catch (error) {
        console.log('assignRoleAndOrder Error: ', error);
    }
};

module.exports.getMemberCountInfo = getMemberCountInfo;