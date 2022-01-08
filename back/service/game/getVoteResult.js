const { User, Game, GameMember, GameVote } = require('../../models');
const {printErrorLog, printLog} = require('../../util/log');
const db = require('../../models');

const getVoteResult = async (req, res, next) => {
    try {
        if(res.locals.role != 'human'){
            res.status(403).json({
                message: '권한이 없습니다.',
            });
            return;
        }

        const { gameSetIdx } = req.params;
        const { voteResultList } =await calculateVoteResultIncludedCnt(res.locals.gameIdx, gameSetIdx);
    
        res.json({ vote_result: voteResultList });
        printLog("투표결과", {vote_result: voteResultList});
    } catch (error) {
        printErrorLog('getVoteResult', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const getVoteList = async (gameSetIdx) => {
    const getVoteListSql = ` SELECT distinct GameVote.game_vote_cnt, GameVote.game_set_game_set_idx, GameVote.game_member_game_member_idx, game_member_game_member_idx_GameMember.game_member_idx AS 'game_member_game_member_idx_GameMember.game_member_idx', 
    game_member_game_member_idx_GameMember.wrm_user_idx AS 'game_member_game_member_idx_GameMember.wrm_user_idx', game_member_game_member_idx_GameMember.game_member_role AS 'game_member_game_member_idx_GameMember.game_member_role' 
    FROM GameVote AS GameVote INNER JOIN GameMember AS game_member_game_member_idx_GameMember ON GameVote.game_member_game_member_idx = game_member_game_member_idx_GameMember.game_member_idx
    WHERE GameVote.game_set_game_set_idx = ${gameSetIdx}
    ORDER BY GameVote.game_vote_cnt DESC;`
    return await db.sequelize.query(
        getVoteListSql,
        { type: db.sequelize.QueryTypes.SELECT }
    );
};

const calculateVoteResult = async (gameIdx, gameSetIdx, numberLimit) => {
    const game = await Game.findOne({
        where: { game_idx: gameIdx },
    });
    const gameVotes = await getVoteList(gameSetIdx);
    printLog("calculateVoteResult", gameSetIdx+"세트 "+gameVotes.length+"명이 투표 획득");

    if(!gameVotes){
        return { game, topVoteRankList:[], score:false };
    }

    const voteRankJSON = {};
    const voteCntOrderList = [];
    for (const vote of gameVotes) {
        voteCnt = vote.game_vote_cnt;
        if (voteRankJSON[voteCnt]) {
            voteRankJSON[voteCnt].push(vote);
        } else {
            voteRankJSON[voteCnt] = [vote];
            voteCntOrderList.push(voteCnt);
        }
    }

    let topVoteRankList = []; //user_idx, user_name, game_rank_no
    let score = false;
    for (const index in voteCntOrderList) {
        const cnt = voteCntOrderList[index];
        for (const gameMember of voteRankJSON[cnt]) {
            // update top vote list
            const user = await User.findOne({
                attributes: ['user_idx', 'user_name'],
                where: {
                    user_idx: gameMember['game_member_game_member_idx_GameMember.wrm_user_idx'],
                },
            });
            topVoteRankList.push({
                user_idx: user.user_idx,
                user_name: user.user_name,
                game_rank_no: Number(index) + 1,
            });
            // check if the voted person is a human
            if (
                gameMember['game_member_game_member_idx_GameMember.game_member_role'] == 'human'
            ) {
                score = true;
            }
        }
        if (numberLimit && topVoteRankList.length >= numberLimit) break;
    }
    console.log("투표수리스트: ", voteCntOrderList);
    return { game, topVoteRankList, score };
};

const calculateVoteResultIncludedCnt = async (gameIdx, gameSetIdx) => {
    const game = await Game.findOne({
        where: { game_idx: gameIdx },
    });
    const gameVotes = await getVoteList(gameSetIdx);
    printLog("calculateVoteResultIncludedCnt", gameSetIdx+"세트 "+gameVotes.length+"명이 투표 획득");

    if(!gameVotes){
        return {game, voteResultList:[]};
    }

    let voteResultList = []; //user_idx, user_name, game_rank_no

    for (const vote of gameVotes) {
        const user = await User.findOne({
            attributes: ['user_idx', 'user_name'],
            where: {
                user_idx: vote['game_member_game_member_idx_GameMember.wrm_user_idx'],
            },
        });
        voteResultList.push({
            user_idx: user.user_idx,
            user_name: user.user_name,
            vote_cnt: vote.game_vote_cnt,
        });
    }
    //printLog("투표결과",voteResultList);
    return { game, voteResultList };
};

module.exports = {
    getVoteResult,
    getVoteList,
    calculateVoteResult,
}

/*
const calculateVoteResult = async (gameIdx, gameSetIdx, numberLimit, hasCnt) => {
    const game = await Game.findOne({
        where: { game_idx: gameIdx },
    });
    const gameVotes = await getVoteList(gameSetIdx);
    printLog("calculateVoteResult", gameSetIdx+"세트 "+gameVotes.length+"명이 투표 획득");

    if(!gameVotes){
        return { game, topVoteRankList:[], score:false };
    }

    const voteRankJSON = {};
    const voteCntOrderList = [];
    for (const vote of gameVotes) {
        voteCnt = vote.get('game_vote_cnt');
        if (voteRankJSON[voteCnt]) {
            voteRankJSON[voteCnt].push(vote);
        } else {
            voteRankJSON[voteCnt] = [vote];
            voteCntOrderList.push(voteCnt);
        }
    }

    let topVoteRankList = []; //user_idx, user_name, game_rank_no
    let score = false;
    for (const index in voteCntOrderList) {
        const cnt = voteCntOrderList[index];
        for (const gameMember of voteRankJSON[cnt]) {
            // update top vote list
            const user = await User.findOne({
                attributes: ['user_idx', 'user_name'],
                where: {
                    user_idx: gameMember
                        .get('game_member_game_member_idx_GameMember')
                        .get('wrm_user_idx'),
                },
            });
            if(hasCnt){
                topVoteRankList.push({
                    user_idx: user.user_idx,
                    user_name: user.user_name,
                    vote_cnt: cnt,        
                });
            }else{
                topVoteRankList.push({
                    user_idx: user.user_idx,
                    user_name: user.user_name,
                    game_rank_no: Number(index) + 1,
                    
                });
            }
            
            // check if the voted person is a human
            if (
                gameMember
                    .get('game_member_game_member_idx_GameMember')
                    .get('game_member_role') == 'human'
            ) {
                score = true;
            }
        }
        if (numberLimit && topVoteRankList.length >= numberLimit) break;
    }
    console.log("투표결과",topVoteRankList, "순위: ", voteCntOrderList);
    return { game, topVoteRankList, score };
};

*/