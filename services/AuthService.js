const bCrypt = require('bcrypt-nodejs');

class AuthService {
    constructor(passport) {
        this.passport = passport;
    }

    validatingToken() {
        return this.passport.authenticate("jwt", { session: false });
    }

    async comparePassword({oldPassword, currentPassword}){
        if(!bCrypt.compareSync(oldPassword, currentPassword)){
            return false;
        }
        return true;
    }
}

module.exports = AuthService;
