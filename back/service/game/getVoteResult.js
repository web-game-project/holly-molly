const { User, Game, GameMember, GameVote } = require('../../models');
const {printErrorLog} = require('../../util/log');

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
    } catch (error) {
        printErrorLog('getVoteResult', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};
const getVoteList = async (gameSetIdx) => {
    return await GameVote.findAll({
        include: [
            {
                model: GameMember,
                as: 'game_member_game_member_idx_GameMember',
                required: true,
                attributes: [
                    'game_member_idx',
                    'wrm_user_idx',
                    'game_member_role',
                ],
            },
        ],
        where: {
            game_set_game_set_idx: gameSetIdx,
        },
        order: [['game_vote_cnt', 'DESC']],
    });
};
const calculateVoteResult = async (gameIdx, gameSetIdx, numberLimit) => {
    const game = await Game.findOne({
        where: { game_idx: gameIdx },
    });
    const gameVotes = await getVoteList(gameSetIdx);

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
        console.log("[*******Cnt] ", index, cnt);
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
            topVoteRankList.push({
                user_idx: user.user_idx,
                user_name: user.user_name,
                game_rank_no: Number(index) + 1,
            });
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
    console.log("[***********]",topVoteRankList, score, voteCntOrderList);
    return { game, topVoteRankList, score };
};

const calculateVoteResultIncludedCnt = async (gameIdx, gameSetIdx) => {
    const game = await Game.findOne({
        where: { game_idx: gameIdx },
    });
    const gameVotes = await getVoteList(gameSetIdx);

    if(!gameVotes){
        return {game, voteResultList:[]};
    }

    let voteResultList = []; //user_idx, user_name, game_rank_no

    for (const vote of gameVotes) {
        const user = await User.findOne({
            attributes: ['user_idx', 'user_name'],
            where: {
                user_idx: vote
                    .get('game_member_game_member_idx_GameMember')
                    .get('wrm_user_idx'),
            },
        });
        voteResultList.push({
            user_idx: user.user_idx,
            user_name: user.user_name,
            vote_cnt: vote.get('game_vote_cnt'),
        });
    }
    return { game, voteResultList};
};

module.exports = {
    getVoteResult,
    getVoteList,
    calculateVoteResult,
}