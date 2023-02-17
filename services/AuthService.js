const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/jwt').JWT_SECRET;

class AuthService {
  constructor(passport) {
    this.passport = passport;
  }
  
  validatingToken() {
    return this.passport.authenticate("jwt", { session: false });
  }

  static async newToken({user}){
    return jwt.sign(
      {
        ...user,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
}

module.exports = AuthService;
