const moment = require('moment/moment')
moment.locale('zh-tw')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      models.Course.belongsTo(models.Category,{as:'category'});
      models.Course.belongsTo(models.User,{as:'user'});
      models.Course.hasMany(models.Chapter, { as: 'chapters' });
      models.Course.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'courseId',
        as: 'likeUsers'
      });
    }
  }
  Course.init({//Course表和Category表及User表是有關聯的
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '分类ID必须填写。' },
        notEmpty: { msg: '分类ID不能为空。' },
        async isPresent(value){//請求的參數寫進資料庫前要確認Category表是否有對應的id;避免變成孤兒資料(沒有關聯的資料)
          const category = await sequelize.models.Category.findByPk(value)
          if (!category) throw new Error(`ID为: ${value} 的分类不存在。`);
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '用户ID必须填写。' },
        notEmpty: { msg: '用户ID不能为空。' },
        async isPresent(value) {//請求的參數寫進資料庫前要確認User表是否有對應的id;避免變成孤兒資料(沒有關聯的資料)
          const user = await sequelize.models.User.findByPk(value)
          if (!user) throw new Error(`ID为: ${value} 的用户不存在。`);
        }
      }
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    recommended: DataTypes.BOOLEAN,
    introductory: DataTypes.BOOLEAN,
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER,
    createdAt:{
      type:DataTypes.DATE,
      get(){
        return moment(this.getDataValue("createdAt")).format("LL")
      }
    },
    updatedAt:{
      type:DataTypes.DATE,
      get(){
        return moment(this.getDataValue("updatedAt")).format("LL")
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};