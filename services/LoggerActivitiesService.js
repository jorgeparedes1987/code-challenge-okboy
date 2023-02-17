const LoggerActivities = require('../models').LoggerActivities;

class LoggerActivitiesService {
  constructor(){}

  static async log(postId, userId, action){
    const [log, created] = await LoggerActivities.upsert({
      postId, userId, action
    });
    return log;
  }

  static async getAll(PER_PAGE, PAGE){
    return await LoggerActivities.findAll({
      offset: PER_PAGE * PAGE,
      limit: PER_PAGE,
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = LoggerActivitiesService;