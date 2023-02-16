const express = require("express");
const router = express.Router();

const AuthService = require('../services/AuthService');

const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

  //const authService = new AuthService(passport);
  //const isAuthenticatedAPI = authService.validatingToken();

  /* USER */
//  require('./api/user/index')(router, isAuthenticatedAPI);
require('./api/user/index')(router);
  
  router.get('/healtcheck', async function(req, res){
    try{
      return res.status(200).send('Working!');
    } catch(err){
      return res.json(err);
    }
  });

  return router;
};
