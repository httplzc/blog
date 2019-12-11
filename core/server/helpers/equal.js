module.exports = function equal(value1, value2, trueBack, falseBack, option) {
    return value1 == value2 ? trueBack : falseBack;
}