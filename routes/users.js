const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFoundError,BadRequestError } = require('../utils/errors');
const bcrypt = require('bcryptjs')
/**
 * 查詢_當前登錄用戶_詳情
 * GET /users/me
 */
router.get('/me', async function (req, res) {
  try {
    const userRow = await getUser(req);
    // delete userRow.dataValues.password //刪除取得的密碼欄位
    success(res, '查詢當前用戶信息成功。', { data:userRow });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新_當前登錄用戶_詳情
 * PUT /users/update
 */
router.put('/update', async function (req, res) {
  try {
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar: req.body.avatar
    };

    const userRow = await getUser(req);
    await userRow.update(body);
    success(res, '更新用戶信息成功。', { data:userRow });
  } catch (error) {
    failure(res, error);
  }
});


/**
 * 更新_當前登錄用戶_帳號、密碼
 * PUT /users/updateAccount
 */
router.put('/updateAccount', async function (req, res) {
  try {
    const {email,username,current_password,password,passwordConfirmation} = req.body

    //參數驗證
    if (!current_password) throw new BadRequestError('當前密碼必須填寫。');
    if (!email && !username && !password) {
      throw new BadRequestError('Email、用戶名或密碼至少必填一個。');
    }
    if (password && password !== passwordConfirmation) throw new BadRequestError('兩次輸入的密碼不一致。');

    // 驗證current_password是否和資料庫一樣
    // true參數，可以取得加密的password
    const userRow = await getUser(req,true)
    const isPasswordValid = bcrypt.compareSync(current_password, userRow.password);
    if (!isPasswordValid) throw new BadRequestError('當前密碼不正確。');

    // 動態構建 body
    const body = {
      ...(email && { email }),  // 如果有 email，加入 body
      ...(username && { username }),  // 如果有 username，加入 body
      ...(password && { password }),  // 如果有 password，加入 body
    };

    await userRow.update(body)
    delete userRow.dataValues.password;// 刪除密碼
    success(res, '更新帳號訊息成功。', { data: { userRow } });

  } catch (error) {
    failure(res, error);
  }
});

// 公共方法: 查詢當前用戶
async function getUser(req,showPassword=false) {
  let condition = {}
  if(!showPassword){
    condition = {
      attributes:{exclude:['password']}
    }
  }

  const user = await User.findByPk(req.userId,condition);
  if (!user) throw new NotFoundError(`ID: ${req.userId} 的用戶未找到。`);

  return user;
}

module.exports = router;