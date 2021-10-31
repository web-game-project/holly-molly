const { GameSet } = require('../../models');


module.exports = async (req, res, next) => {
    let { gameSetIdx } = req.params;

    try {
        await GameSet.update(
            {
                game_set_img: req.file.filename,
            },
            { where: { game_set_idx: gameSetIdx } }
        );

        res.status(200).json({message: "success"});
    } catch (error) {
        console.log('saveSetImage Error: ', error);
    }
};