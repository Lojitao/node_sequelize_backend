let express = require('express');
let router = express.Router();
const { BlogCategory,Blog } = require("../../models")
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors');
const { success,failure } = require("../../utils/responses")

// 一般搜尋 => 模糊查詢 => 分頁搜尋
//admin/blogCategory
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
    if(query.name){
      condition.where = {
        name:{
          [Op.like]:`%${query.name}%`
        }
      }
    }
    // count是表全部的總數,row是分頁查詢出的資料
    const {count ,rows} = await BlogCategory.findAndCountAll(condition)
    success(res,'查詢文章類別成功' ,{
      count,
      data:rows, 
    })
  }catch(e){
    failure(res,e)
  }
})

// 取得單筆
//admin/blogCategory/${id}
router.get('/:id', async(req, res, next)=>{
  try{
    const blogCategory = await getBlogCategory(req)
    success(res,'查詢文章分類列表成功' ,{data:blogCategory})
  }catch(e){
    failure(res,e)
  }
});

//新增
//admin/blogCategory
router.post('/', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const blogCategory = await BlogCategory.create(body)
    success(res,'創建文章分類成功' , {
      data:blogCategory,
      code:201
    })
   
  }catch(e){
    console.log('我是錯誤e',e);
    failure(res,e)
  }
});

// 刪除
//admin/blogCategory/${id}
router.delete('/:id', async(req, res, next)=>{
  try{
    const blogCategory = await getBlogCategory(req)

    const count = await Blog.count({ where: { blog_category_id: req.params.id } });
    if (count > 0) throw new Error('當前分類有文章，無法刪除。');
    await blogCategory.destroy()
    success(res,'刪除文章分類成功')
  }catch(e){
    failure(res,e)
  }
});

//更新
//admin/blogCategory/${id}
router.put('/:id', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const blogCategory = await getBlogCategory(req)
    await blogCategory.update(body)
    success(res,'更新文章分類成功')
    
  }catch(e){
    failure(res,e)
  }
});

/**
 * 公共方法：透過id取得單筆資料
 * @param req
 * @returns {Promise<BlogCategory>}
 */
async function getBlogCategory(req){
  // 查询当前文章分類
  const { id } = req.params;

  const condition = {
    include: [
      {
        model: Blog,
        as: 'blogs',
        attributes: ['id', 'title']
      },
    ]
  }

  const blogCategory = await BlogCategory.findByPk(id,condition);

  // 如果没有找到, 就抛出异常
  if (!blogCategory) throw new NotFoundError(`ID: ${id} 的文章分類未找到。`);

  return blogCategory;
}

/**
 * 公共方法：過濾參數
 * @param req
 * @returns {{name, content: (string|string|DocumentFragment|*)}}
 */

function filterBody(req){
  return {
    name: req.body.name,
    // rank: req.body.rank
  };
}

module.exports = router;