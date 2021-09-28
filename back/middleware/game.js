const { User } = require('../models');

module.exports = (req, res, next) => {
    // game_set_idx, game_idx와 user 정보 가지고 방장/방원/마피아/시민인지 체크
    try {
        const user = res.locals.user;
        const { game_set_idx, game_idx } = req.body;
        const { gameSetIdx, gameIdx } = req.param;

        // db 처리

        res.locals.leader = true; // or false
        res.locals.role = "ghost"; // or "human"  
        next();
    } catch (error) {
        console.log(error);
        res.status(403).send({
            message: '게임의 참여자가 아닙니다.',
        });
        return;
    }
};

