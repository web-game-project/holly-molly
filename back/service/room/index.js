const getRoomList = require('./getRoomList');
const makeRoom = require('./makeRoom');
const {enterRoom} = require('./enterRoom');
const {getRoomInfo} = require('./getRoomInfo');
const editRoomInfo = require('./editRoomInfo');
const deleteRoom = require('./deleteRoom');
const getRoom = require('./getRoom');

module.exports = {
    getRoomList,
    makeRoom,
    enterRoom,
    getRoomInfo,
    editRoomInfo,
    deleteRoom,
    getRoom,
};
