module.exports = function shuffleList(list) {
    list.sort(() => Math.random() - 0.5);
}