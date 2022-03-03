// map[key] : {promiseResolve, value}
const voteMap = new Map(); // key: gameSetIdx, value:numberOfRequests
const waitMap = new Map(); // key: gameSetIdx, value:membersSet
const mapObject = { waitMap: waitMap, voteMap: voteMap };

const startTimer = async (
    mapName,
    mapKey,
    mapValue,
    time,
    condition,
    afterFunction,
    additionalParameter
) => {
    try {
        printLog('startTimer', mapName + ' ' + gameSetIdx + '세트 timer 시작');
        map = mapObject[mapName];
        map.set(mapKey, { promiseResolve: undefined, value: mapValue });

        let timerId;
        let promise = new Promise((resolve, reject) => {
            timerId = setTimeout(() => resolve(false), time * 1000);
            map.get(mapKey)['promiseResolve'] = resolve;
        });

        let promiseResult = await promise; // resolve 조건 충족 시 true, timeout 시 false
        clearTimeout(timerId);

        if (promiseResult == condition) {
            if (mapName === 'waitMap') {
                afterFunction(
                    mapKey,
                    map.get(mapKey)['value'],
                    ...additionalParameter
                );
            } else if (mapName === 'voteMap') {
                afterFunction(...additionalParameter);
            }
        }

        map.delete(mapKey);
        printLog('startTimer', mapName + ' ' + gameSetIdx + '세트 timer 끝');
    } catch (error) {
        printErrorLog('startTimer', error);
    }
};

module.exports = startTimer;
module.exports.mapObject = mapObject;
