const verifyJWT = require('../util/jwt/verifyJWT');
const { User } = require('../models');
const {printErrorLog} = require('../util/log')

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;
       
        if (authorization == undefined) {
            res.status(401).send({
                message: '로그인 후 이용해주세요.',
            });
            return;
        }

        const [tokenType, tokenValue] = authorization.split(' ');

        if (tokenType !== 'Bearer') {
            res.status(401).send({
                message: '로그인 후 이용해주세요.',
            });
            return;
        }

        let decodedToken;
        try {
            decodedToken = verifyJWT.verifyAccessToken(tokenValue);
        } catch (error) {
            try {
                const isRefresh =
                    req.route.path == '/refresh' &&
                    error.name == 'TokenExpiredError';
                if (isRefresh) {
                    decodedToken = verifyJWT.decode(tokenValue);
                } else {
                    res.status(401).send({
                        message: '로그인 후 이용해주세요.',
                    });
                    return;
                }
            } catch (error) {}
        }
      
        User.findByPk(decodedToken.user_idx).then((user) => {
            if (!user) {
                res.status(401).send({
                    message: '로그인 후 이용해주세요.',
                });
                return;
            }

            res.locals.user = user;
            next();
        });
    } catch (error) {
        printErrorLog('authMiddleware', error);
        res.status(401).send({
            message: '로그인 후 이용해주세요.',
        });
        return;
    }
};
