const regexEmail = /\S+@\S+\.\S+/;

module.exports.isValidEmail = function(email){
    return regexEmail.test(email);
}