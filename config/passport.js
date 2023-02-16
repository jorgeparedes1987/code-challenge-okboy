const ExtractJwt = require('passport-jwt').ExtractJwt;
const bCrypt = require('bcrypt-nodejs');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

const JWT_SECRET = require('./jwt').JWT_SECRET;
var AuthService = require('../services/AuthService');
const User = require('../models/User');

module.exports = function(passport){
    AuthService = new AuthService(passport);
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = JWT_SECRET;

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ', user);
        done(null, user._id);
    });

    passport.deserializeUser(async function(id, done) {
       const user = await (User.findById(id));
       
       if(!user) return done('Forbidden');

        console.log('deserializing user:',user);

        done(null, user);
    });

    passport.use('jwt', new JwtStrategy(opts, async function(jwt_payload, done) {
        try{
            const user = await User.findById(jwt_payload._id);
            
            if(!user) return done({error: 'User does not exists'});

            return done(null, user);
        }catch(err){
            return done(err);
        }
    }));

    passport.use(new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
    },
        async function(username, password, done) {
            try{
                var user = (await User.findOne({email: username})).toObject();

                if(!user) return done({error: 'Invalid username or password'});

                const passwordCompare = await AuthService.comparePassword({oldPassword: password, currentPassword: user.password});             
                if(!passwordCompare){
                    return done({error: 'Invalid username or password'});
                }
                
                user.jwt_token = 'JWT ' + jwt.sign(
                    {
                        _id: user._id,
                    },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return done(null, user);
            }
            catch(err){
                return done(err);
            }
        })
    );
}
