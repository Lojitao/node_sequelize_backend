const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError } = require('../utils/errors');
const { failure } = require('../utils/responses');

module.exports = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) throw new UnauthorizedError('當前接口需要認證才能訪問。');
      
    // 驗證 token 是否正確
    const decoded = jwt.verify(token, process.env.SECRET);
    
    // 從 jwt 中，解析出之前存入的 userId
    const { userId } = decoded;
    
    // 如果通過驗證，將 userId 對象賦值到 req 上，方便後續中間件或路由使用
    req.user = userId;
    
    next();// 一定要加 next()，才能繼續進入到後續中間件或路由
  } catch (error) {
    failure(res, error);
  }
};