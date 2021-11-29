const signJWT = require('../../util/jwt/signJWT');
const verifyJWT = require('../../util/jwt/verifyJWT');
const {printErrorLog} = require('../../util/log');

module.exports = async (req, res, next) => {
    try {
        const { refresh_token } = req.body;
        const user = res.locals.user;

        // refresh token 값 비교 및 유효시간 체크
        if (user.refresh_token != refresh_token) {
            res.status(400).json({
                message: '유효하지 않은 refresh token입니다.',
            });
            return;
        }
        verifyJWT.verifyRefreshToken(refresh_token);

        // access token 재발급
        const accessToken = signJWT.makeAccessToken(user);
        res.json({
            access_token: accessToken,
        });
    } catch (error) {
        printErrorLog('login', error);
        res.status(401).json({
            message: '로그인 후 다시 이용하세요.',
        });
    }
};
