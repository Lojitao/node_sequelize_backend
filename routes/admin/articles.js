let express = require('express');
let router = express.Router();
const { Article } = require("../../models")
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors');
const { success,failure } = require("../../utils/response")

// 一般搜尋 => 模糊查詢 => 分頁搜尋
//admin/articles
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
    const {count ,rows} = await Article.findAndCountAll(condition)
    success(res,'查詢文章列表成功' ,{
      count,
      data:rows, 
    })
  }catch(e){
    failure(res,e)
  }
})

// 取得單筆
//admin/articles/${id}
router.get('/:id', async(req, res, next)=>{
  try{
    const article = await getArticle(req)
    success(res,'查詢文章列表成功' ,{data:article})
  }catch(e){
    failure(res,e)
  }
});

//新增
//admin/articles
router.post('/', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const article = await Article.create(body)
    success(res,'創建文章成功' , {
      data:article,
      code:201
    })
   
  }catch(e){
    console.log('我是錯誤e',e);
    failure(res,e)
  }
});

//更新
//admin/articles/${id}
router.put('/:id', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const article = await getArticle(req)
    await article.update(body)
    success(res,'更新文章成功')
    
  }catch(e){
    failure(res,e)
  }
});

// 刪除
// /admin/articles/${id}
router.delete('/:id', async(req, res, next) => {
  try {
    const article = await getArticle(req)
    await article.destroy()
    success(res, '刪除文章成功')
  } catch(e) {
    failure(res, e)
  }
});

/**
 * 公共方法：透過id取得單筆資料
 * @param req
 * @returns {Promise<Article>}
 */
async function getArticle(req){
  
  // 查询当前文章
  const { id } = req.params;
  const article = await Article.findByPk(id);

  // 如果没有找到, 就抛出异常
  if (!article) throw new NotFoundError(`ID: ${id} 的文章未找到。`);

  return article;
}

/**
 * 公共方法：過濾參數
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */

function filterBody(req){
  return {
    title: req.body.title,
    content: req.body.content
  };
}

module.exports = router;