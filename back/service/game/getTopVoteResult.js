const {calculateVoteResult} = require('./getVoteResult');
const {printErrorLog, printLog} = require('../../util/log');

const getTopVoteResult = async (req, res, next) => {
    try {
        const { gameSetIdx } = req.params;
        const { topVoteRankList } = await calculateVoteResult(
            res.locals.gameIdx,
            gameSetIdx,
            2
        );
  
        res.json({ vote_rank: topVoteRankList });
    } catch (error) {
        printErrorLog('getTopVoteResult', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

module.exports = {
    getTopVoteResult
}

