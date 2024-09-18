let express = require('express');
let router = express.Router();
const { Article } = require("../../models")
const { Op } = require('sequelize')
const { NotFoundError,success,failure } = require("../../untils/response")

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
    if (query.email) {
      condition.where = {
        email: {
          [Op.eq]: query.email//精確查找
        }
      };
    }
    
    if (query.username) {
      condition.where = {
        username: {
          [Op.eq]: query.username//精確查找
        }
      };
    }
    
    if (query.nickname) {
      condition.where = {
        nickname: {
          [Op.like]: `%${ query.nickname }%`//模糊查找
        }
      };
    }
    
    if (query.role) {
      condition.where = {
        role: {
          [Op.eq]: query.role//精確查找
        }
      };
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