const AuthService = require('../../../services/AuthService');

module.exports = function (router, passport) {
  router.post('/auth/login', async(req, res) => {
    passport.authenticate('local', {session: false}, async(err, user, info) => {
      try{
        if(err){
          throw new Error(info.message || err.message);
        }
        if(!user) throw new Error('User does not exist');
        req.login(user, {session: false}, async(err) => {
            if (err) throw err;
            const token = await AuthService.newToken({user});
            return res.json({ token });
          }
        );
      } catch(err){
        return res.status(500).send({code: 'InternalServerError', message: err.message || JSON.stringify(err)})
      }
    })(req, res);
  });
}
