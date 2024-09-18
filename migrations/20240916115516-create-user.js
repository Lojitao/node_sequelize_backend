'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: '邮箱必须填写。' },
          notEmpty: { msg: '邮箱不能为空。' },
          isEmail: { msg: '邮箱格式不正确。' },
          async isUnique(value){
            const user = await User.findOne({ where: { email: value } });
            if (user) throw new Error('郵箱已存在，請直接登陸。');
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: '用户名必须填写。' },
          notEmpty: { msg: '用户名不能为空。' },
          len: { args: [2, 45], msg: '用户名长度必须是 2 ~ 45 之间。' },
          async isUnique(value) {
            const user = await User.findOne({ where: { username: value } });
            if (user) throw new Error('用户名已经存在。');
          }
        }
      },
      password: {//TODO:
        allowNull:false,
        type: Sequelize.STRING
      },
      nickname: {//TODO:
        allowNull:false,
        type: Sequelize.STRING
      },
      sex: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          notNull: { msg: '性别必须填写。' },
          notEmpty: { msg: '性别不能为空。' },
          isIn: { args: [[0, 1, 2]], msg: '性别的值必须是，男性: 0 女性: 1 未选择: 2。' }
        }
      },
      company: {
        type: Sequelize.STRING
      },
      introduce: {
        type: Sequelize.TEXT
      },
      role: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          notNull: { msg: '用户组必须选择。' },
          notEmpty: { msg: '用户组不能为空。' },
          isIn: { args: [[0, 100]], msg: '用户组的值必须是，普通用户: 0 管理员: 100。' }
        }
      },
      avatar: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: '图片地址不正确。' }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex(
      'Users', {
        fields: ['email'],  // 要索引的字段
        unique: true        // 唯一索引
      }
    );
    await queryInterface.addIndex(
      'Users', {
        fields: ['username'],
        unique: true
      }
    );
    await queryInterface.addIndex(
      'Users', {
        fields: ['role']
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};