//自訂成功的res訊息
function success(res, message, options = {}) {
  const { data, count, code = 200 } = options;

  const response = {
    status: code,
    message,
  };

  // 如果 data 有值則加入到 response 中
  if (data !== undefined) {
    response.data = data;
  }

  // 如果 count 有值則加入到 response 中
  if (count !== undefined) {
    response.count = count;
  }

  res.status(code).json(response);
}

//自訂義錯誤處理
function failure(res, error) {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(e => e.message)
    return res.status(400).json({
      status: 400,
      message: '請求參數錯誤',
      errors
    });
  }

  if (error.name === 'BadRequestError') {
    return res.status(400).json({
      status: false,
      message: '请求参数错误',
      errors: [error.message]
    });
  }
  
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: [error.message]
    });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      status: 404,
      message: '資源不存在',
      errors: [error.message]
    });
  }

  res.status(500).json({
    status: 500,
    message: '服務器錯誤',
    errors: [error.message]
  });
}

module.exports = {
  success,
  failure
}