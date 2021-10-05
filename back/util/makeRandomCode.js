const makeRandomCode = function (stringLength) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var randomCode = '';
    for (var i = 0; i < stringLength; i++) {
        var randomNum = Math.floor(Math.random() * chars.length);
        randomCode += chars.substring(randomNum, randomNum + 1);
    }
    return randomCode;
}

module.exports = makeRandomCode;
