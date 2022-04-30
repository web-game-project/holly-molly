const { GameSet, Keyword } = require('../../models');
const { printLog, printErrorLog } = require('../../util/log');

const getKeywordLength = async (req, res, next) => {
    let { gameSetIdx } = req.params;

    try {
        const childKeyword = await getChildKeyword(gameSetIdx);
        res.status(200).json({length:childKeyword.length});
    } catch (error) {
        printErrorLog('getKeywordLength', error)
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

const getChildKeyword = async (gameSetIdx) => {
    const childKeyword = await GameSet.findOne({
        include: [
            {
                model: Keyword,
                as: 'keyword_keyword_idx_Keyword',
                required: true,
                attributes: ['keyword_child'],
            },
        ],
        where: { game_set_idx: gameSetIdx },
    });
    
    return childKeyword.keyword_keyword_idx_Keyword.get('keyword_child');
}

module.exports = {
    getKeywordLength,
}