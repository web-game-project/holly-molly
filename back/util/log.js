const moment = require('moment'); 
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

printErrorLog = (fileName, error) => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss'); 
    console.log(`[error]-${fileName}(${date}): `, error);
}
printLog = (fileName, message) => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss'); 
    console.log(`[log]-${fileName}(${date}): `, message);
}
module.exports = {printErrorLog, printLog}


