const User = require('../models').User;

class UserService {
  constructor(userId, name, email, permissions){
    this.userId = userId || undefined;
    this.name = name;
    this.email = email;
    this.permissions = permissions;
  }

  async create(){
    const [user, created] = await User.upsert({
      name: this.name, 
      email: this.email, 
      permissions: this.permissions
    });
    return user;
  }

  async update(){
    const [updatedRows] = await User.update({
      name: this.name, 
      permissions: this.permissions
    },{
      where: {id: this.userId}
    });
    return updatedRows;
  }

  static async delete(userId){
    const user = await User.findOne({
      where: { id: userId }
    });
    if(user){
      await user.destroy();
    }
  }

  static async getAll(PER_PAGE, PAGE){
    return await User.findAll({
      offset: PER_PAGE * PAGE,
      limit: PER_PAGE,
      order: [['createdAt', 'DESC']]
    });
  }

  static async getById(userId){
    return await User.findOne({
      where: { id: userId }
    });
  }

  static async get(where){
    return await User.findOne({
      where
    });
  }

  static async isAdmin({userId}){
    const user = await User.findOne({
      where: { id: userId }
    });
    if(!user) return false;

    return user.permissions.search(/admin/) > -1;
  }
}
module.exports = UserService;