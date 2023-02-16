'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
        onDelete: 'CASCADE',
      });
    }
  }
  Post.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
