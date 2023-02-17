const express = require("express");
const router = express.Router();

const AuthService = require('../services/AuthService');
const hasPermission = require('../policies/hasPermission');
const isAdmin = require('../policies/isAdmin');

module.exports = function(passport) {

  const authService = new AuthService(passport);
  const isAuthenticatedAPI = authService.validatingToken();

  /* USER */
  require('./api/user/index')(router, isAuthenticatedAPI, isAdmin);
  /* AUTH */
  require('./api/auth/index')(router, passport);
  /* POST */
  require('./api/posts/index')(router, isAuthenticatedAPI, hasPermission);
  /* LOGS */
  require('./api/loggerActivities/index')(router, isAuthenticatedAPI);
  /* REVIEWS */
  require('./api/reviews/index')(router);
  
  router.get('/healtcheck', async function(req, res){
    try{
      return res.status(200).send('Working!');
    } catch(err){
      return res.json(err);
    }
  });

  return router;
};
