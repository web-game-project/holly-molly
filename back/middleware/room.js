const { User } = require('../models');

module.exports = (req, res, next) => {
    // room_idx와 user 정보 가지고 방장/방원 체크
    try {
        const user = res.locals.user;
        const { room_idx } = req.body;
        const { roomIdx } = req.param;

        // db 처리

        res.locals.leader = true; // or false
        next();
    } catch (error) {
        console.log(error);
        res.status(403).send({
            message: '대기실의 참여자가 아닙니다.',
        });
        return;
    }
};

