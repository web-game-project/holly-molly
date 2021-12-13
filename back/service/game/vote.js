const { User, Game, GameMember, GameSet, GameVote } = require('../../models');
const db = require('../../models');
const { getVoteList, calculateVoteResult, } = require('./getVoteResult');
const {printErrorLog} = require('../../util/log');
const { gameSchema } = require('../../util/joi/schema');

const vote = async (req, res, next) => {
    try {
        const { error, value } = gameSchema.vote.validate(req.body);
        const { game_set_idx, user_idx } = value;
        if(error){
            res.status(400).json({
                error: error.details[0].message
            });
            return;
        }

        const io = req.app.get('io');
    
        const gameVoteList = await getVoteList(game_set_idx);

        if (!gameVoteList || gameVoteList.length == 0) {
            // first vote
            if (!timerResolveMap.get(game_set_idx)) {
                timer(game_set_idx, 15, finishVote, [
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
        printErrorLog('vote', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
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
        clearTimeout(timerId);
        timerResolveMap.delete(mapKey);
        numberOfRequeststMap.delete(mapKey);

        afterFunction(...functionParameterList);
        return result;
    } catch (error) {
        printErrorLog('vote-timer', error);
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
const finishVote = async (gameIdx, gameSetIdx, io) => {
    const { game, topVoteRankList, score } = await calculateVoteResult(
        gameIdx,
        gameSetIdx,
        2
    );
        
    if (score) {
        addGhostScore(gameSetIdx);
    }
    
    io.to(game.get('room_room_idx')).emit('vote', { vote_rank: topVoteRankList });
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

module.exports = vote;