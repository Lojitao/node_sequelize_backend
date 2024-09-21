let express = require('express');
let router = express.Router();
const { Setting } = require("../models")
const { NotFoundError } = require('../utils/errors');
const { success,failure } = require("../utils/responses")

// 取得單筆
// /setting
router.get('/', async(req, res, next)=>{
  try{
    const setting = await getSetting()
    success(res,'查詢設定列表成功' ,{data:setting})
  }catch(e){
    failure(res,e)
  }
});

/**
 * 公共方法：透過id取得單筆資料
 * @param req
 * @returns {Promise<Setting>}
 */
async function getSetting(){
  //查询單筆設定資料
  const setting = await Setting.findOne();

  //如果没有找到, 就抛出异常
  if (!setting) throw new NotFoundError(`初始系統設置未找到，請運行種子文件`)

  return setting;
}

module.exports = router;