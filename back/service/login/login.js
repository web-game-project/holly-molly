const signJWT = require('../../util/jwt/signJWT');
const { User } = require('../../models');
const {printErrorLog, printLog } = require('../../util/log')
const { userSchema } = require('../../util/joi/schema');
const axios = require('axios');

module.exports = async (req, res, next) => {
    try {
        const { error, value } = userSchema.login.validate(req.body);
        const { name } = value;
        if(error){
            res.status(400).json({
                error: error.details[0].message
            });
            return;
        }

        const user = await User.create({
            user_name: name,
        });

        const accessToken = signJWT.makeAccessToken(user);
        const refreshToken = signJWT.makeRefreshToken(user);
        await updateRefreshTokenOfUser(refreshToken, user.user_idx);

        printLog("LOGIN-", user.user_idx+"번 "+name+"님 로그인 성공");
        res.json({
            access_token: accessToken,
            refresh_token: refreshToken,
            user_idx: user.user_idx,
        });

        //await postSlackMsg(user.user_idx, name);
    } catch (error) {
        printErrorLog('login', error);
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다.',
            error: error.message,
        });
    }
};

const updateRefreshTokenOfUser = async (refreshToken, userIdx) => {
    await User.update(
        {
            refresh_token: refreshToken,
        },
        { where: { user_idx: userIdx } }
    );
};

const postSlackMsg = async (userIdx, name) => {
    await axios({
        url: 'https://hooks.slack.com/services/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',
        method: 'post',
        data: {
            "text": `${userIdx}번 ${name} 님 로그인 성공`,
            "username": "HollyMolly Server",
            "icon_emoji": ":purple_ghost:"
        }
    })
    .then(function (response) {
        printErrorLog('SLACK_SUCCESS -', error);
    })
    .catch(function (error) {
        printErrorLog('SLACK_ERROR - ', error);
    });
}
