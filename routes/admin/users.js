let express = require('express');
let router = express.Router();
const { User } = require("../../models")
const { Op } = require('sequelize')
const { NotFoundError,success,failure } = require("../../untils/response")

// 一般搜尋 => 模糊查詢 => 分頁搜尋
//admin/users
router.get('/', async(req, res, next)=>{
  try{
    const query = req.query

    // 當前第幾頁，沒傳預設第一頁。
    // Math.abs()是取機對值。
    const currentPage = Math.abs(Number(query.currentPage)) || 1

    // 一頁要顯示多少筆，沒傳預設一頁10筆
    const pageSize = Math.abs(Number(query.pageSize)) || 10

    //計算offset
    const offset = (currentPage-1) * pageSize

    const condition = {
      order:[['id','DESC']],
      limit:pageSize,
      offset:offset
    }
    if(query.title){
      condition.where = {
        title:{
          [Op.like]:`%${query.title}%`
        }
      }
    }
    // count是表全部的總數,row是分頁查詢出的資料
    const {count ,rows} = await User.findAndCountAll(condition)
    success(res,'查詢使用者列表成功' ,{
      count,
      data:rows, 
    })
  }catch(e){
    failure(res,e)
  }
})

// 取得單筆
//admin/users/${id}
router.get('/:id', async(req, res, next)=>{
  try{
    const user = await getUser(req)
    success(res,'查詢使用者列表成功' ,{data:user})
  }catch(e){
    failure(res,e)
  }
});

//新增
//admin/users
router.post('/', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const user = await User.create(body)
    success(res,'創建使用者成功' , {
      data:user,
      code:201
    })
   
  }catch(e){
    console.log('我是錯誤e',e);
    failure(res,e)
  }
});

// 刪除
//admin/users/${id}
router.delete('/:id', async(req, res, next)=>{
  try{
    const user = await getUser(req)  
    await user.destroy()
    success(res,'刪除使用者成功')
  }catch(e){
    failure(res,e)
  }
});

//更新
//admin/users/${id}
router.put('/:id', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const user = await getUser(req)
    await user.update(body)
    success(res,'更新使用者成功')
    
  }catch(e){
    failure(res,e)
  }
});

/**
 * 公共方法：透過id取得單筆資料
 * @param req
 * @returns {Promise<User>}
 */
async function getUser(req){
  // 查询当前使用者
  const { id } = req.params;
  const user = await User.findByPk(id);

  // 如果没有找到, 就抛出异常
  if (!user) throw new NotFoundError(`ID: ${id} 的使用者未找到。`);

  return user;
}

/**
 * 公共方法：過濾參數
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */

function filterBody(req){
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  };
}

module.exports = router;