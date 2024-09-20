const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/response');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')//node自帶

/**
 * 管理员登录
 * POST /admin/auth/sign_in
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

    // 驗證是否管理員
    if (user.role !== 100) throw new UnauthorizedError('您沒有權限登錄管理員後台。');

    
    //生成隨機的 32 字符長度的密鑰
    // const secret = crypto.randomBytes(32).toString('hex');
    // console.log('secret',secret);
    

    //生成身份驗證令牌
    const token = jwt.sign(
      {userId: user.id},
      process.env.SECRET, 
      {expiresIn: '30s'}
    );

    success(res, '登入成功。', { data:token });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;