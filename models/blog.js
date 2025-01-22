'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Blog 與 BlogCategory 是多對一關係
      models.Blog.belongsTo(models.BlogCategory, {
        as: 'blogCategory',
        foreignKey: 'blog_category_id',
      });
    }
  }

  Blog.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: '標題必須填寫。' },
          notEmpty: { msg: '標題不能為空。' },
          len: { args: [2, 255], msg: '長度必須是 2 ~ 255 之間。' },
        },
      },
      blog_category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false, // 設定為必填
        validate: {
          notNull: { msg: '分類 ID 必須填寫。' }, // 必填提示
          isInt: { msg: '分類 ID 必須為整數。' }, // 必須為整數
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: '內容必須填寫。' },
          notEmpty: { msg: '內容不能為空。' },
          len: { args: [10, 5000], msg: '內容長度必須在 10 到 5000 字之間。' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Blog',
    }
  );

  return Blog;
};