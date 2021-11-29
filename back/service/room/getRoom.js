const { Room } = require('../../models');
const {printErrorLog} = require('../../util/log');
const {getWaitingRoomMemberListAndLeader} = require('./enterRoom');

module.exports = async (req, res, next) => {
    try {
        const {roomIdx} = req.params;

        let room = await getRoomInfo(roomIdx);

        const { waitingRoomMemberList, leader_idx } =
            await getWaitingRoomMemberListAndLeader(roomIdx);

        if (!waitingRoomMemberList || !leader_idx) {
            printErrorLog('getRoom', roomIdx+'번방 방원/방장이 존재하지 않음');
            res.status(400).json({
                message: '알 수 없는 오류가 발생했습니다.',
            });
            return;
        }
       
        res.status(200).json({
            room_idx: roomIdx,
            room_name: room.room_name,
            room_code: room.room_code,
            room_start_member_cnt: room.room_start_member_cnt,
            room_current_member_cnt: waitingRoomMemberList.length,
            leader_idx,
            waiting_room_member_list: waitingRoomMemberList,
        });

    } catch (error) {
        printErrorLog('getRoom', error);
        res.status(400).json({
            meesage: '알 수 없는 에러가 발생했습니다.',
            error: error.message,
        });
    }
};

// 추후에 getRoomInfo.js에 있는거로 대체
const getRoomInfo = async (roomIdx) => {
    const roomInfo = await Room.findOne(
        {
            attributes: [
                'room_idx',
                'room_name',
                'room_code',
                'room_private',
                'room_mode',
                'room_start_member_cnt',
            ],
            where: { room_idx: roomIdx } 
        },
    );

    return roomInfo;
}
