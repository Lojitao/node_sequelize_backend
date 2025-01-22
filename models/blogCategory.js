'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlogCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // BlogCategory 與 Blog 是一對多關係
      models.BlogCategory.hasMany(models.Blog, {
        as: 'blogs',
        foreignKey: 'blog_category_id',
      });
    }
  }

  BlogCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: '分類名稱必須填寫。' },
          notEmpty: { msg: '分類名稱不能為空。' },
          len: { args: [2, 45], msg: '長度必須是 2 ~ 45 之間。' },
          async isUnique(value) {
            const category = await BlogCategory.findOne({ where: { name: value } });
            if (category) throw new Error('分類名稱已存在，請選擇其他名稱。');
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'BlogCategory',
    }
  );

  return BlogCategory;
};