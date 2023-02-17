const JwtStrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JWT_SECRET = require('./jwt').JWT_SECRET;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: JWT_SECRET
}
const UserService = require('../services/UserService');

module.exports = function(passport){

  passport.use('jwt', new JwtStrategy(opts, async(jwt_payload, done) => {
    try{
      const existingUser = await UserService.getById(jwt_payload.id);
      if(!existingUser) return done({error: 'User does not exist'});
      return done(null, existingUser);
    }catch(err){
      return done(err);
    }
  }));

  passport.use(
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      }, async (email, password, done) => {
        try {
          const user = await UserService.get({ email: email });
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          return done(null, user.dataValues, { message: 'Logged in' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}