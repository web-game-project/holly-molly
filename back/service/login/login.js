const signJWT = require('../../util/jwt/signJWT');
const { User } = require('../../models');

module.exports = async (req, res, next) => {
    try {
        const { name } = req.body;

        const user = await User.create({
            user_name: name,
        });

        const accessToken = signJWT.makeAccessToken(user);
        const refreshToken = signJWT.makeRefreshToken(user);
        await updateRefreshTokenOfUser(refreshToken, user.user_idx);
   
        res.json({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
};

const updateRefreshTokenOfUser = async(refreshToken, userIdx) => {
    await User.update(
        {
            refresh_token: refreshToken,
        },
        { where: { user_idx: userIdx } }
    );
}