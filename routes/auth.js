const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/errors');
const { success, failure } = require('../utils/responses');
const jwt = require('jsonwebtoken')


/**
 * 用戶註冊
 * POST /admin/sign_up
 */
router.post('/sign_up', async (req, res) => {
  try {
    const { email,username,nickname,password } = req.body;
    const body = {
      email,username,nickname,password,
      sex:2,
      role:0
    }
    const userRow = await User.create(body)
    delete userRow.dataValues.password //刪除取得的密碼欄位
    success(res, '註冊成功。', { data:userRow });
  } catch (error) {
    failure(res, error);
  }
});



/**
 * 用戶登入
 * POST /auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login) throw new BadRequestError('信箱/帳號必須填寫。');
    if (!password) throw new BadRequestError('密碼必須填寫。');

    const condition = { 
      where: {
        [Op.or]: [ 
          { email: login }, 
          { username: login } 
        ] 
      } 
    };

    // 通过 email 或 username，查询用户是否存在
    const user = await User.findOne(condition);
    if (!user) throw new NotFoundError('用戶不存在。');

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('密碼錯誤。');

    //生成身份驗證令牌
    const token = jwt.sign(
      {userId: user.id},
      process.env.SECRET, 
      {expiresIn: '3h'}
    );

    success(res, '登入成功。', { data:token });
  } catch (error) {
    failure(res, error);
  }
});



module.exports = router;



    //生成隨機的 32 字符長度的密鑰
    // const secret = crypto.randomBytes(32).toString('hex');
    // console.log('secret',secret);
    