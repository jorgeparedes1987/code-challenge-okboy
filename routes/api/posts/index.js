
const PostService = require('../../../services/PostService');

const PER_PAGE = 21;

module.exports = function (router, isAuthenticatedAPI, hasPermission) {

  router.get('/post/list', async(req, res) => {
    try{
      if(!req.query.page) return res.status(400).send({code: 'PostListBadRequest', message: 'Page parameter is expected.'});
      const PAGE = (req.query.page <= 0) ? req.query.page : req.query.page - 1;
      let where;
      if(req.query.startDate && req.query.endDate){
        where = { createdAt: {$gte: req.query.startDate}, createdAt: { $lte: req.query.endDate}};
      }
      const users = await PostService.getAll(PER_PAGE, PAGE, where);
      if(!users) return res.status(404).send({code: 'PostListNotFoundItems', message: 'Posts not found'});
      return res.status(200).send(users);
    }
    catch(err){
      console.log('Error while getting user list, ', err);
      return res.status(500).send({code: 'PostListInternalServerError', message: 'Error while getting post list.'});
    }
  });

  router.post('/post', isAuthenticatedAPI, hasPermission, async(req, res) => {
    try{
      const { title, content, userId } = req.body;
      if(!title || !content || !userId) return res.status(400).send({code: 'PostCreateBadRequest', message: 'Missing parameters'});
      const postService = new PostService(null, title, content, userId);
      const postCreated = await postService.create();
      return res.status(201).send(postCreated);
    }
    catch(err){
      console.log('Error while creating a post, ', err);
      return res.status(500).send({code: 'PostCreateInternalServerError', message: 'Error while creating a post'});
    }
  });

  router.put('/post/:postId', isAuthenticatedAPI, hasPermission, async(req, res) => {
    try{
      const postId = req.params.postId;
      const { title, content, userId } = req.body;
      if(!title || !content || !userId) return res.status(400).send({code: 'PostCreateBadRequest', message: 'Missing parameters'});
      const postService = new PostService(postId, title, content, userId);
      await postService.update();
      return res.status(200).send({ title, content, userId });
    }
    catch(err){
      console.log('Error while creating a post, ', err);
      return res.status(500).send({code: 'PostCreateInternalServerError', message: 'Error while creating a post'});
    }
  });

  router.delete('/post/:postId', isAuthenticatedAPI, hasPermission, async(req, res) => {
    try{
      const postId = req.params.postId;
      const postDeleted = await PostService.delete(postId, req.user.id);
      return res.status(200).send(postDeleted);
    }
    catch(err){
      console.log('Error while creating a post, ', err);
      return res.status(500).send({code: 'PostCreateInternalServerError', message: 'Error while creating a post'});
    }
  });

  return router;
}