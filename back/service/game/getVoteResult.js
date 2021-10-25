const { Room, Game, GameSet, GameMember, WaitingRoomMember, KeyWord } = require('../../models');
const { calculateVoteResult } = require('./vote');

module.exports = async (req, res, next) => {
    try {
        if(res.locals.role != 'human'){
            res.staus(403).json({
                message: '권한이 없습니다.',
            });
            return;
        }

        const { gameSetIdx } = req.params;
        const { game, topVoteRankList } =await calculateVoteResult(res.locals.gameIdx, gameSetIdx, undefined);
    
        res.json({ vote_rank: topVoteRankList });

        const io = req.app.get('io');
        io.to(game.get('room_room_idx')).emit('votesubmit human answer', { human_submit: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};
