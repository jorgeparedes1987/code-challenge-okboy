
// Modulo para hacer una validación de  login.
var bodyParser = require('body-parser');
var Candidatas = require('../../../models/developer/candidata');
var myLogger = require('../../../utilities/Logger');
var User = require('../../../models/usuario/user');
var bCrypt = require('bcrypt-nodejs');


module.exports = function (router,passport) {




    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }


        var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    /*
        Parameters

    */


    router.post('/registervalidation', function(req, res){


        console.log('Usuario:' + req.body.username);

        User.findOne({username: req.body.username}, function(err, data_user){

            if(data_user)
            {
                    console.log('Dentro de data user:'+ data_user);
                    if(data_user.username)
                    {
                        var response = {
                            error: true,
                            mensaje: "El nombre de usuario ya se encuentra utilizado."
                        };
                        res.json(response);
                        res.end();
                    }
            }
            else
            {

                   var response = {
                    error: false,
                    mensaje: null
                };
                res.json(response);
                res.end();
            }
        });


    });

    router.post('/loginvalid', function(req, res){

        var login = req.body;
        var response = {};

        if(login.username && login.password)
        {


            console.log('Nombre de usuario:'+ login.username);
            console.log('Password:' + login.password);


            User.findOne({username: login.username}, function(err, result){

                if(!err){


                    if(result){

                        console.log('Password crypted send by form:' + createHash(login.password));
                        console.log('Password on database:'+ result.password);

                        if(isValidPassword(result,login.password)){
                            response = {
                                error: false,
                                mensaje: "Usuario y contraseña existen"
                            };
                            res.send(response);
                            res.end();

                        }
                        else
                        {

                            response = {
                                error: true,
                                mensaje: "El usuario y/o la contraseña son invalidos"
                            }
                            res.send(response);
                            res.end();


                        }


                    }
                    else
                    {

                            response = {
                                error: true,
                                mensaje: "El usuario y/o la contraseña son invalidos"
                            }
                            res.send(response);
                            res.end();

                    }

                }
                else
                {


                            response = {
                                error: true,
                                mensaje: "El usuario y/o la contraseña son invalidos"
                            }
                            res.send(response);
                            res.end();


                }
            });


        }


    });

    return router;

}
