const { GameSet, GameMember, User } = require('../models');
const { Op } = require("sequelize");
const { exitGameAndRoom, deleteUser } = require('../service/game/exitGame');
const { gameSchema } = require('../util/joi/schema');
const { printLog, printErrorLog } = require('../util/log');
//const { startTimer } = require('../util/startTimer');
//const { waitMap } = require('../util/startTimer').mapObject;

module.exports = async (socket, io, data) => {
    const { error, value } = gameSchema.waitHumanAnswer.validate(data);
    let { game_set_idx } = value;

    if(error){
        io.to(socket.id).emit('error', {event: 'wait human answer', error: error.details[0].message});
        return;
    }
    if(!socket.user_idx){
        io.to(socket.id).emit('error', {event: 'wait human answer', error: "잠시 후 다시 event를 보내주세요."});
        return;
    }

    const gameIdx = await findGameIdx(game_set_idx);
    const gameMember = await findGameMember(gameIdx, socket.user_idx);
    if(!gameMember){
        io.to(socket.id).emit('error', {event: 'wait human answer', error: "게임 참여자가 아닙니다."});
        return;
    }

    if(!waitingMap.get(game_set_idx)){ // first ghost
        //startTimer("waitMap", game_set_idx, new Set([socket.user_idx]), 15, false, exitUnConnectedMembers, [io]); 
        startWaitingTimer(game_set_idx,new Set([socket.user_idx]),15,io);
    }else{
        //waitMap.get(game_set_idx)["value"].add(socket.user_idx);
        waitingMap.get(game_set_idx)["members"].add(socket.user_idx);
    }
    printLog('waitHumanAnswer', `${socket.user_idx}번 user ${game_set_idx}세트 게임, 유령리스트:${[...waitingMap.get(game_set_idx)["members"]]}`);
};

// timer
const waitingMap = new Map(); // key: gameSetIdx, value: {timerResolve: timerResolve, members: membersSet}
const startWaitingTimer = async (gameSetIdx, memberList, time, io) => {
    try {
        printLog('waitingGhost-startWaitingTimer', gameSetIdx+"세트 timer 시작");
        waitingMap.set(gameSetIdx, {"timerResolve":undefined, "members":memberList});

        let timerId;
        let promise = new Promise((resolve, reject) => {
            timerId = setTimeout(() => resolve(false), time * 1000);
            waitingMap.get(gameSetIdx)["timerResolve"] = resolve;
        });

        let whetherToSubmitAnswer = await promise;
        clearTimeout(timerId);
        
        if(!whetherToSubmitAnswer){ // 인간이 시간 이내에 답안 제출하지 않은 경우
            printLog('waitingGhost-startWaitingTimer', gameSetIdx+"세트 time out, 인간이 답안 제출하지 않음");
            const gameIdx = await findGameIdx(gameSetIdx);
            
            // 인간 비정상 종료
            //const human = await findHuman(gameIdx);
            //exitGameAndRoom(human, io);

            // wait event 보내지 않은 게임멤버(유저+인간) 비정상 종료
            const unConnectedMembers = await getNonListedMembers(gameIdx,[...waitingMap.get(gameSetIdx)["members"]]);
            for(let member of unConnectedMembers){
                let userToLeave = await findUser(member['wrm_user_idx']);
                await exitGameAndRoom(userToLeave, io);
                await deleteUser(member['wrm_user_idx']);
            }
        }
        
        waitingMap.delete(gameSetIdx);
        printLog('waitingGhost-startWaitingTimer', gameSetIdx+"세트 waitingTimer 끝");
    } catch (error) {
        printErrorLog('waitingGhost-startWaitingTimer', error);
    }
};
const findGameIdx = async (gameSetIdx) => {
    const game = await GameSet.findOne({
        attributes: ['game_game_idx'],
        where: {
            game_set_idx: gameSetIdx,
        },
    }); 
    return game['game_game_idx'];
}
const findGameMember = async (gameIdx, userIdx) => {
    const gameMmeber = await GameMember.findOne({
        where: {
            game_game_idx: gameIdx,
            wrm_user_idx: userIdx,
        },
    });
    return gameMmeber;
};
const getNonListedMembers = async (gameIdx, memberList) => {
    return await GameMember.findAll({
        attributes: ['wrm_user_idx'],
        where: {
            game_game_idx: gameIdx,
            wrm_user_idx: {[Op.notIn]: memberList},
        },
    });
}
const findUser = async (userIdx) => {
    return await User.findOne({
        where: {
            user_idx: userIdx,
        }
    })
}

const resolveWaitingMap = async (gameSetIdx) => {
    if(waitingMap.get(gameSetIdx)){
        const timerResolve = waitingMap.get(gameSetIdx)["timerResolve"];
        timerResolve(true);
        printLog('waitingGhost-resolveWaitingMap', gameSetIdx+"세트 waitingMap Resolve");
    }
};

const exitUnConnectedMembers = async (gameSetIdx, connectedMemberSet, io) => {
    const gameIdx = await findGameIdx(gameSetIdx);
    // wait event 보내지 않은 게임멤버(유저+인간) 비정상 종료
    const unConnectedMembers = await getNonListedMembers(gameIdx, [
        ...connectedMemberSet,
    ]);
    for (let member of unConnectedMembers) {
        let userToLeave = await findUser(member['wrm_user_idx']);
        await exitGameAndRoom(userToLeave, io);
        await deleteUser(member['wrm_user_idx']);
    }
};

module.exports.resolveWaitingMap = resolveWaitingMap;
/*
const findHuman = async (gameIdx) => {
    const humanIdx = await GameMember.findOne({
        attributes: ['wrm_user_idx'],
        where: {
            game_game_idx: gameIdx,
            game_member_role: 'human',
        },
    })['wrm_user_idx']; 

    return await User.findOne({
        where: {
            user_idx: humanIdx,
        },
    });
}*/