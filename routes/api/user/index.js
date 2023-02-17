const isValidEmail = require('../../../utilities/isValidEmail').isValidEmail;
const UserService = require('../../../services/UserService');

const PER_PAGE = 21;

module.exports = function (router, isAuthenticatedAPI, isAdmin) {

  router.get('/user/list', isAuthenticatedAPI, isAdmin, async(req, res) => {
    try{
      if(!req.query.page) return res.status(400).send({code: 'UserListBadRequest', message: 'Page parameter is expected.'});
      const PAGE = (req.query.page <= 0) ? req.query.page : req.query.page - 1;
      const users = await UserService.getAll(PER_PAGE, PAGE);
      if(!users) return res.status(404).send({code: 'UserListNotFoundItems', message: 'Users not found'});
      return res.status(200).send(users);
    }
    catch(err){
      console.log('Error while getting user list, ', err);
      return res.status(500).send({code: 'UserListInternalServerError', message: 'Error while getting user list.'});
    }
  });

  router.post('/user', isAuthenticatedAPI, isAdmin, async(req, res) => {
    try{
      const { name, email, permissions } = req.body;
      if(!name || !isValidEmail(email) || !permissions) return res.status(400).send({code: 'UserCreateBadRequest', message: 'Missing parameters'});
      const userService = new UserService(name, email, permissions);
      const userCreated = await userService.create();
      return res.status(201).send(userCreated);
    }
    catch(err){
      console.log('Error while creating user, ', err);
      return res.status(500).send({code: 'UserCreateInternalServerError', message: 'Error while creating user'});
    }
  });

  router.put('/user/:userId', isAuthenticatedAPI, isAdmin, async(req, res) => {
    try{
      const userId = req.params.userId;
      const { name, permissions } = req.body;
      if(!name || !permissions) return res.status(400).send({code: 'UserCreateBadRequest', message: 'Missing parameters'});
      const userService = new UserService(userId, name, null, permissions);
      await userService.update();
      return res.status(200).send({ name, permissions });
    }
    catch(err){
      console.log('Error while updating user, ', err);
      return res.status(500).send({code: 'UserUpdateInternalServerError', message: 'Error while updating user'});
    }
  });

  router.delete('/user/:userId', isAuthenticatedAPI, isAdmin, async(req, res) => {
    try{
      const userId = req.params.userId;
      const userService = new UserService(userId);
      const userCreated = await userService.delete();
      return res.status(201).send(userCreated);
    }
    catch(err){
      console.log('Error while deleting user, ', err);
      return res.status(500).send({code: 'UserDeleteInternalServerError', message: 'Error while deleting user'});
    }
  });

  return router;
}