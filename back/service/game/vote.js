const { Game, GameMember, GameSet, GameVote } = require('../../models');
const moveRoom = require('../../socket/moveRoom');

const timerResolveMap = new Map(); // key: gameSetIdx
const numberOfRequeststMap = new Map(); // key: gameSetIdx

module.exports = async (req, res, next) => {
    try {
        const { game_set_idx, user_idx } = req.body;

        const gameVoteList = await GameVote.findAll({
            include: [
                {
                    models: GameMember,
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
            timer(game_set_idx, 15, sendVoteResult); //15초지나면map에서지움, 투표 결과 전송
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
        res.status(201).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

const timer = async (gameSetIdx, time, afterFunction, functionParameterList) => {
    try {
        numberOfRequeststMap.set(gameSetIdx, 0);

        let timerId;
        let promise = new Promise((resolve, reject) => {
            timerId = setTimeout(() => resolve('time out'), time * 1000);
            timerResolveMap.set(gameSetIdx, resolve);
        });

        let result = await promise;
        clearTimeout(timerId);
        timerResolveMap.delete(gameSetIdx);
        numberOfRequeststMap.delete(gameSetIdx);

        afterFunction(...functionParameterList);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const sendVoteResult = async () => {
    voteRank = []; //user_idx, user_name, game_rank_no
    io.to(roomIdx).emit('vote', { vote_rank: voteRank });
}