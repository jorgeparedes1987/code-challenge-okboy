const regexPrice = /^\d+(?:\.\d{0,2})$/;

module.exports.isValidPrice = function(price){
    return regexPrice.test(price);
}