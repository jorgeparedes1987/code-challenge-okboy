const LoggerActivitiesService = require('../../../services/LoggerActivitiesService');

const PER_PAGE = 21;

module.exports = function (router, isAuthenticatedAPI) {

  router.get('/logs', isAuthenticatedAPI, async(req, res) => {
    try{
      if(!req.query.page) return res.status(400).send({code: 'LogListBadRequest', message: 'Page parameter is expected.'});
      const PAGE = (req.query.page <= 0) ? req.query.page : req.query.page - 1;
      const logs = await LoggerActivitiesService.getAll(PER_PAGE, PAGE);
      if(!logs) return res.status(404).send({code: 'LogsNotFound', message: 'Logs not found'});
      return res.status(200).send(logs);
    }
    catch(err){
      console.log('Error while getting log list, ', err);
      return res.status(500).send({code: 'LogListInternalServerError', message: 'Error while getting log list.'});
    }
  });

  return router;
}