const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Story model
class Story extends Model {}

// create fields/columns for Post model
Story.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    status:{
       type: DataTypes.ENUM(['public', 'private']),
       default: 'public',
    }
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'story'
  }
);

module.exports = Story;
