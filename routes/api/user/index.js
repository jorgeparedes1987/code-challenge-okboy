const User = require('../../../models').User;

const PER_PAGE = 21;

module.exports = function (router) {

    router.get('/user/list', async function(req, res){
        try{
            if(!req.query.page) return res.status(400).send({code: 'UserListBadRequest', message: 'Page parameter is expected.'});
            const PAGE = (req.query.page <= 0) ? req.query.page : req.query.page - 1;
console.log('User', User);
            const users = await User.findAll({
              offset: PER_PAGE * PAGE,
              limit: PER_PAGE,
              order: [['createdAt', 'DESC']]
            });

            if(!users) return res.status(404).send({code: 'UserListNotFoundItems', message: 'Users not found'});

            return res.status(200).send(users);
        }
        catch(err){
            console.log('Error while getting user list, ', err);
            return res.status(500).send({code: 'UserListInternalServerError', message: 'Error while getting user list.'});
        }
    });

    return router;
}