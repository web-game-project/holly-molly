const { Room } = require('../../models');

module.exports = async (req, res, next) => {
    let { roomIdx } = req.params;

    try {
        await Room.destroy(
            { where: { room_idx: roomIdx } }
        );

        const io = req.app.get('io');
        let data = { room_idx: roomIdx };
        io.to('0').emit('delete room', data);

        res.status(200).json("success");
    } catch (error) {
        console.log('getRoomInfoService Error: ', error);
    }
};
