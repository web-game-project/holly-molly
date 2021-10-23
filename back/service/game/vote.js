const { User, Game, GameMember, GameSet, GameVote } = require('../../models');
const moveRoom = require('../../socket/moveRoom');
const db = require('../../models');
const timerResolveMap = new Map(); // key: gameSetIdx
const numberOfRequeststMap = new Map(); // key: gameSetIdx

module.exports = async (req, res, next) => {
    try {
        const { game_set_idx, user_idx } = req.body;
        const io = req.app.get('io');

        const gameVoteList = await GameVote.findAll({
            include: [
                {
                    model: GameMember,
                    as: 'game_member_game_member_idx_GameMember',
                    required: true,
                    attributes: ['game_member_idx','wrm_user_idx'],
                }
            ],
            where: {
                game_set_game_set_idx: game_set_idx
            }
        });

        //디비에 첫삽입이먄
        //map에 넣어주고
        if(!gameVoteList || gameVoteList.length == 0){
            timer(game_set_idx, 15, sendVoteResult, [res.locals.gameIdx, game_set_idx, io]); 
            let voteMemberId = await GameMember.findOne({
                where:{
                    wrm_user_idx: user_idx,
                }
            });
            voteMemberId = voteMemberId.get('game_member_idx');

            await GameVote.create({
                game_vote_cnt: 1,
                game_set_game_set_idx: game_set_idx,
                game_member_game_member_idx: voteMemberId,
            });
        }else{
            const timerResolve = timerResolveMap.get(game_set_idx);
            if(!timerResolve){
                res.status(400).json({message:"투표가 이미 종료되었습니다."});
                return;
            }
            
            let voteMemberId = undefined;
            for (const vote of gameVoteList){
                if (user_idx == vote.get('game_member_game_member_idx_GameMember').get('wrm_user_idx')){
                    voteMemberId = vote.get('game_member_game_member_idx_GameMember').get('game_member_idx');
                    break;
                }
            }
            if(!voteMemberId){
                voteMemberId = await GameMember.findOne({
                    where:{
                        wrm_user_idx: user_idx,
                    }
                });
                voteMemberId = voteMemberId.get('game_member_idx');

                await GameVote.create({
                    game_vote_cnt: 1,
                    game_set_game_set_idx: game_set_idx,
                    game_member_game_member_idx: voteMemberId,
                });
            }else{
                const updateGameVoteQuery = `UPDATE GameVote SET game_vote_cnt = game_vote_cnt + 1 WHERE game_member_game_member_idx=${voteMemberId}`
                await db.sequelize.query(
                    updateGameVoteQuery,
                    { type: db.sequelize.QueryTypes.UPDATE }
                );
            }  
        }

        numberOfRequeststMap.set(game_set_idx, numberOfRequeststMap.get(game_set_idx)+1);
        const memberCount = await GameMember.findAll({
            where: { game_game_idx: res.locals.gameIdx },
        });
        res.status(201).json({});
        if(numberOfRequeststMap.get(game_set_idx)==memberCount.length){
            const timerResolve = timerResolveMap.get(game_set_idx)
            timerResolve('success');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

const timer = async (mapKey, time, afterFunction, functionParameterList) => {
    try {
        numberOfRequeststMap.set(mapKey, 0);

        let timerId;
        let promise = new Promise((resolve, reject) => {
            timerId = setTimeout(() => resolve('time out'), time * 1000);
            timerResolveMap.set(mapKey, resolve);
        });

        let result = await promise;
        console.log("********", result);
        clearTimeout(timerId);
        timerResolveMap.delete(mapKey);
        numberOfRequeststMap.delete(mapKey);

        afterFunction(...functionParameterList);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const sendVoteResult = async (gameIdx, gameSetIdx, io) => {
    const game = await Game.findOne({
        where: { game_idx: gameIdx, }
    });
    const gameVoteList = await GameVote.findAll({
        include: [
            {
                model: GameMember,
                as: 'game_member_game_member_idx_GameMember',
                required: true,
                attributes: ['game_member_idx','wrm_user_idx'],
            }
        ],
        where: {
            game_set_game_set_idx: gameSetIdx
        },
        order: [['game_vote_cnt', 'DESC']],
    });
    const voteRank = {};
    for(const vote of gameVoteList){
        voteCnt = vote.get('game_vote_cnt')
        voteRank[voteCnt] = voteRank[voteCnt] ? voteRank[voteCnt].push(vote) : [vote];
    }

    const voteRankList = []; //user_idx, user_name, game_rank_no

    /*
    for(const voteCnt in voteRank){
        for(const index in voteRank[voteCnt]){
            const gameMember = voteRank[voteCnt][index];
            const user = await User.findOne({
                attributes: ['user_idx','user_name'],
                where: { user_idx: gameMember.get('game_member_game_member_idx_GameMember').get('wrm_user_idx'), }
            })
            voteRankList.push({user_idx:user.user_idx, user_name:user.user_name, game_rank_no:Number(index)+1})
        }
        if(voteRankList.length>1) break;
    }
    console.log(gameVoteList);
    console.log(voteRank, voteRankList);
    io.to(game.get('game_idx')).emit('vote', { vote_rank: voteRankList });
    */
}