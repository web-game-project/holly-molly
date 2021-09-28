const jwt = require('jsonwebtoken');
const { jwtAccessKey } = require('../config/config');
const { User } = require('../models');

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (authorization == undefined) {
            res.status(401).send({
                message: '회원가입 후 사용하세요.',
            });
            return;
        }

        const [tokenType, tokenValue] = authorization.split(' ');

        if (tokenType !== 'Bearer') {
            res.status(401).send({
                message: '회원가입 후 사용하세요.',
            });
            return;
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(tokenValue, jwtAccessKey);
        } catch (error) {
            try {
                if (
                    req.route.path != '/refresh' ||
                    error.name != 'TokenExpiredError'
                ) {
                    res.status(401).send({
                        message: '회원가입 후 사용하세요.',
                    });
                    return;
                }
            } catch (error) {}
        }

        User.findByPk(decodedToken.user_idx).then((user) => {
            if (!user) {
                res.status(401).send({
                    message: '회원가입 후 사용하세요.',
                });
                return;
            }

            res.locals.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({
            message: '회원가입 후 사용하세요.',
        });
        return;
    }
};
