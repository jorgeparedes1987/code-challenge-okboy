const Reviews = require('../models').Reviews;

class ReviewsService {
  constructor(postId, rate, userId){
    this.postId = postId;
    this.rate = rate;
    this.userId = userId;
  }

  async create(){
    const [review, created] = await Reviews.upsert({
      postId: this.postId, 
      rate: this.rate,
      userId: this.userId 
    });
    return review;
  }
}

module.exports = ReviewsService;
