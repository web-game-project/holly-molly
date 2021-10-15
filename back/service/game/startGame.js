const { Game } = require('../../models');
const { Keyword } = require('../../models');
const { WaitingRoomMember } = require('../../models');
const { GameMember } = require('../../models');
const { GameSet } = require('../../models');
const sequelize = require('sequelize');

module.exports.startGame = async (req, res, next) => {
    let { room_idx } = req.body;

    try {
        const io = req.app.get('io');
        // socket : change game status
        io.to(0).emit('change game status', {
            room_idx: room_idx,
            room_status: 'playing',
        });

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

        let data = {game_idx, game_set_idx, user_list};
        io.to(room_idx).emit('start game', data);
        
        res.status(200).json("success");
    } catch (error) {
        console.log('startGame Error: ', error);
    }
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
        const member = await WaitingRoomMember.findAll({
            attributes: ['wrm_idx', 'user_user_idx', 'wrm_user_color'],
            where: {
                room_room_idx: roomIdx,
            },
        });

        let memberIdxList = [];
        for (let i = 0; i < member.length; i++) {
            let wrm_idx = member[i].dataValues.wrm_idx;
            let user_user_idx = member[i].dataValues.user_user_idx;
            let wrm_user_color = member[i].dataValues.wrm_user_color;
            memberIdxList.push({ wrm_idx, user_user_idx, wrm_user_color });
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
        if (i == random_idx) roleList.push(1);
        //"citizen"
        else roleList.push(0); //"ghost"
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
            memberInfoList.push({
                user_idx: wrm_user_idx,
                game_member_order: orderList[i],
                user_color,
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
