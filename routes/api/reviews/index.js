const ReviewsService = require('../../../services/ReviewsService');

const PER_PAGE = 21;

module.exports = function (router) {

  router.post('/review', async(req, res) => {
    try{
      const { postId, rate } = req.body;
      const userId = (!req.user?.id) ? 0 : req.user.id;
      const reviewsService = new ReviewsService(postId, rate, userId);
      const reviewCreated = reviewsService.create();
      return res.status(200).send(reviewCreated);
    }
    catch(err){
      console.log('Error while creating review, ', err);
      return res.status(500).send({code: 'ReviewCreateInternalServerError', message: 'Error while creating review.'});
    }
  });

  return router;
}