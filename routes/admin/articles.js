let express = require('express');
let router = express.Router();
const { Article } = require("../../models")
const {Op} = require('sequelize')

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
    res.json({
      coed:200,
      message:'查詢文章列表成功',
      total:count,
      // currentPage,
      // pageSize,
      data:{
        articles:rows
      }
    })
  }catch(e){
    res.status(500).json({
      status:500,
      message:'查詢文章列表失敗',
      error:[e.message]
    })
  }
})

// 取得單筆
//admin/articles/${id}
router.get('/:id', async(req, res, next)=>{
  try{
    const {id} = req.params
    const articles = await Article.findByPk(id)
    if(articles){
      res.json({
        status:true,
        message:'查詢文章列表成功',
        data:{articles}
      })
    }else{
      res.status(400).json({
        status:false,
        message:'無此文章'
      })
    }
  }catch(e){
    res.status(500).json({
      status:false,
      message:'查詢文章列表失敗',
      error:[e.message]
    })
  }
});

// 新增
//admin/articles
router.post('/', async(req, res, next)=>{

  try{
    const article = await Article.create(req.body)
    res.status(201).json({
      code:200,
      status:true,
      message:'創建文章成功',
      data:article
    })
  }catch(e){
    if(e.name==='SequelizeValidationError'){
      const handleError = e.errors.map(item=>item.message)
      res.status(400).json({
        code:400,
        message:'請求參數錯誤',
        error:handleError
      })
    }else{
      res.status(500).json({
        status:false,
        message:'新增文章失敗',
        error:[e.message]
      })
    }
  }
});

// 刪除
//admin/articles/${id}
router.delete('/:id', async(req, res, next)=>{
  try{
    const {id} = req.params
    const article = await Article.findByPk(id)
    if(article){
      await article.destroy()
      res.json({
        code:200,
        message:'刪除文章成功',
      })
    }
  }catch(e){
    res.status(500).json({
      status:false,
      message:'新增文章失敗',
      error:[e.message]
    })
  }
});

//更新
//admin/articles/${id}
router.put('/:id', async(req, res, next)=>{
  try{
    const {id} = req.params
    const article = await Article.findByPk(id)
    if(article){
      await article.update(req.body)
      res.json({
        code:200,
        message:'更新文章成功',
        data:article
      })
    }else{
      res.status(404).json({
        code:404,
        message:'更新未找到',
      })
    }
  }catch(e){
    res.status(500).json({
      status:500,
      message:'更新文章失敗',
      error:[e.message]
    })
  }
});



module.exports = router;