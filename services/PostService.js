const {Reviews, Post} = require('../models');
const LoggerActivitiesService = require('./LoggerActivitiesService');

class PostService {
  constructor(postId, title, content, userId){
    this.postId = postId || undefined;
    this.title = title;
    this.content = content;
    this.userId = userId;
  }

  async create(){
    const [post, created] = await Post.upsert({
      title: this.title, 
      content: this.content, 
      userId: this.userId
    });
    await LoggerActivitiesService.log(post.id, this.userId, 'created');
    return post;
  }

  async update(){
    const [updatedRows] = await Post.update({
      title: this.title, 
      content: this.content, 
      userId: this.userId
    },{
      where: {id: this.postId}
    });
    await LoggerActivitiesService.log(this.postId, this.userId, 'updated');
    return updatedRows;
  }

  static async delete(postId, userId){
    const post = await Post.findOne({
      where: { id: postId }
    });
    if(post){
      await post.destroy();
    }
    await LoggerActivitiesService.log(postId, userId, 'deleted');
  }

  static async getAll(PER_PAGE, PAGE, where = false){
    return await Post.findAll({
      where: (!where) ? where : undefined,
      offset: PER_PAGE * PAGE,
      limit: PER_PAGE,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Reviews,
        as: 'reviews'
       }]
    });
  }

  static async getById(postId){
    return await Post.findOne({
      where: { id: postId }
    });
  }

  static async get(where){
    return await Post.findOne({
      where
    });
  }
}
module.exports = PostService;