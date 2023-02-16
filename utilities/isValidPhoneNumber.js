const regexPhoneNumber = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

module.exports.isValidPhoneNumber = function(phoneNumber){
    return regexPhoneNumber.test(phoneNumber);
}