const { User, Game, GameMember, GameSet, GameVote } = require('../../models');
const moveRoom = require('../../socket/moveRoom');
const db = require('../../models');

const vote = async (req, res, next) => {
    try {
        const { game_set_idx, user_idx } = req.body;
        const io = req.app.get('io');
    
        const gameVoteList = await getVoteList(game_set_idx);

        if (!gameVoteList || gameVoteList.length == 0) {
            // first vote
            if (!timerResolveMap.get(game_set_idx)) {
                timer(game_set_idx, 15, voteResult, [
                    res.locals.gameIdx,
                    game_set_idx,
                    io,
                ]);
            }
            await voteByCreating(game_set_idx, user_idx);
        } else {
            const timerResolve = timerResolveMap.get(game_set_idx);
            if (!timerResolve) {
                res.status(400).json({
                    message: '투표가 이미 종료되었습니다.',
                });
                return;
            }

            let voteRecipientsIdx = undefined;
            for (const vote of gameVoteList) {
                voteGameMember = vote.get(
                    'game_member_game_member_idx_GameMember'
                );
                if (user_idx == voteGameMember.get('wrm_user_idx')) {
                    voteRecipientsIdx = voteGameMember.get('game_member_idx');
                    break;
                }
            }

            if (!voteRecipientsIdx) {
                await voteByCreating(game_set_idx, user_idx);
            } else {
                await voteByUpdating(voteRecipientsIdx);
            }
        }
        numberOfRequeststMap.set(
            game_set_idx,
            numberOfRequeststMap.get(game_set_idx) + 1
        );
        res.status(201).json({});

        checkNumberOfVoters(res.locals.gameIdx, game_set_idx);
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};

// timer
const timerResolveMap = new Map(); // key: gameSetIdx
const numberOfRequeststMap = new Map(); // key: gameSetIdx
const timer = async (mapKey, time, afterFunction, functionParameterList) => {
    try {
        numberOfRequeststMap.set(mapKey, 0);

        let timerId;
        let promise = new Promise((resolve, reject) => {
            timerId = setTimeout(() => resolve('time out'), time * 1000);
            timerResolveMap.set(mapKey, resolve);
        });

        let result = await promise;
        console.log('[vote-timer]', result);
        clearTimeout(timerId);
        timerResolveMap.delete(mapKey);
        numberOfRequeststMap.delete(mapKey);

        afterFunction(...functionParameterList);
        return result;
    } catch (error) {
        console.log(error);
    }
};
const checkNumberOfVoters = async (gameIdx, gameSetIdx) => {
    const memberCount = await GameMember.findAll({
        where: { game_game_idx: gameIdx },
    });
    if (numberOfRequeststMap.get(gameSetIdx) == memberCount.length) {
        const timerResolve = timerResolveMap.get(gameSetIdx);
        timerResolve('success');
    }
};

// vote
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
const voteByCreating = async (gameSetIdx, userIdx) => {
    let voteRecipients = await GameMember.findOne({
        where: {
            wrm_user_idx: userIdx,
        },
    });

    await GameVote.create({
        game_vote_cnt: 1,
        game_set_game_set_idx: gameSetIdx,
        game_member_game_member_idx: voteRecipients.get('game_member_idx'),
    });
};
const voteByUpdating = async (voteRecipientsIdx) => {
    const updateGameVoteQuery = `UPDATE GameVote SET game_vote_cnt = game_vote_cnt + 1 WHERE game_member_game_member_idx=${voteRecipientsIdx}`;
    await db.sequelize.query(updateGameVoteQuery, {
        type: db.sequelize.QueryTypes.UPDATE,
    });
};

// vote result
const voteResult = async (gameIdx, gameSetIdx, io) => {
    const { game, topVoteRankList, score } = await calculateVoteResult(
        gameIdx,
        gameSetIdx,
        2
    );
        
    if (score) {
        addGhostScore(gameSetIdx);
    }

    console.log(game.get('room_room_idx'), topVoteRankList);
    io.to(game.get('room_room_idx')).emit('vote', { vote_rank: topVoteRankList });
};
const calculateVoteResult = async (gameIdx, gameSetIdx, numberLimit) => {
    const game = await Game.findOne({
        where: { game_idx: gameIdx },
    });
    const gameVotes = await getVoteList(gameSetIdx);

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
const addGhostScore = async (gameSetIdx) => {
    const gameSet = await GameSet.findOne({
        where: {
            game_set_idx: gameSetIdx,
        },
    });
    GameSet.update(
        {
            game_set_ghost_score: gameSet.get('game_set_no'),
        },
        {
            where: {
                game_set_idx: gameSetIdx,
            },
        }
    );
};

module.exports = {
    vote,
    calculateVoteResult,
};