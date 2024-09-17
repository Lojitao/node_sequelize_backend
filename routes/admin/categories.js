let express = require('express');
let router = express.Router();
const { Category } = require("../../models")
const { Op } = require('sequelize')
const { NotFoundError,success,failure } = require("../../untils/response")

// 一般搜尋 => 模糊查詢 => 分頁搜尋
//admin/category
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
    const {count ,rows} = await Category.findAndCountAll(condition)
    success(res,'查詢分類列表成功' ,{
      count,
      data:rows, 
    })
  }catch(e){
    failure(res,e)
  }
})

// 取得單筆
//admin/category/${id}
router.get('/:id', async(req, res, next)=>{
  try{
    const category = await getCategory(req)
    success(res,'查詢分類列表成功' ,{data:category})
  }catch(e){
    failure(res,e)
  }
});

//新增
//admin/category
router.post('/', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const category = await Category.create(body)
    success(res,'創建分類成功' , {
      data:category,
      code:201
    })
   
  }catch(e){
    console.log('我是錯誤e',e);
    failure(res,e)
  }
});

// 刪除
//admin/category/${id}
router.delete('/:id', async(req, res, next)=>{
  try{
    const category = await getCategory(req)  
    await category.destroy()
    success(res,'刪除分類成功')
  }catch(e){
    failure(res,e)
  }
});

//更新
//admin/category/${id}
router.put('/:id', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const category = await getCategory(req)
    await category.update(body)
    success(res,'更新分類成功')
    
  }catch(e){
    failure(res,e)
  }
});

/**
 * 公共方法：透過id取得單筆資料
 * @param req
 * @returns {Promise<Category>}
 */
async function getCategory(req){
  // 获取分類 ID
  // console.log('req',req);
  
  const { id } = req.params;

  // 查询当前分類
  const category = await Category.findByPk(id);

  // 如果没有找到, 就抛出异常
  if (!category) {
    throw new NotFoundError(`ID: ${id} 的分類未找到。`);
  }

  return category;
}

/**
 * 公共方法：過濾參數
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */

function filterBody(req){
  console.log('req',req);
  
  return {
    name: req.body.name,
    rank: req.body.rank
  };
}

module.exports = router;