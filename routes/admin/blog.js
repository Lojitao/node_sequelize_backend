let express = require('express');
let router = express.Router();
const { Course,User,Chapter,BlogCategory,Blog } = require("../../models")
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors');
const { success,failure } = require("../../utils/responses")

// 一般搜尋 => 模糊查詢 => 分頁搜尋
//admin/blogs
router.get('/', async(req, res, next)=>{
  try{
    const query = req.query

    // 當前第幾頁，沒傳預設第一頁。Math.abs()是取機對值。
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    // 一頁要顯示多少筆，沒傳預設一頁10筆
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    //計算offset
    const offset = (currentPage-1) * pageSize

    const condition = {
      ...getCondition(),
      order:[['id','DESC']],
      limit:pageSize,
      offset:offset
    }
    
    if (query.blogCategoryId) {
      condition.where = {
        blog_category_id: {
          [Op.eq]: query.blogCategoryId
        }
      };
    }
    // if (query.userId) {
    //   condition.where = {
    //     userId: {
    //       [Op.eq]: query.userId
    //     }
    //   };
    // }
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`
        }
      };
    }

    // count是表全部的總數,row是分頁查詢出的資料
    const {count ,rows} = await Blog.findAndCountAll(condition)
    success(res,'查詢文章列表成功' ,{
      count,
      data:rows, 
    })
  }catch(e){
    failure(res,e)
  }
})

// 取得單筆
//admin/blogs/${id}
router.get('/:id', async(req, res, next)=>{
  try{
    const blog = await getBlog(req)
    success(res,'查詢文章列表成功' ,{data:blog})
  }catch(e){
    failure(res,e)
  }
});

//新增
//admin/blogs
router.post('/', async(req, res, next)=>{
  try{
    const body = filterBody(req)  
    // body.userId = req.user.id//取得從middlewares賦值的user
    const blog = await Blog.create(body)
    success(res,'創建文章成功' , {
      data:blog,
      code:201
    })
   
  }catch(e){
    console.log('我是錯誤e',e);
    failure(res,e)
  }
});

//更新
//admin/blogs/${id}
router.put('/:id', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const blog = await getBlog(req)
    await blog.update(body)
    success(res,'更新文章成功')
    
  }catch(e){
    failure(res,e)
  }
});

// 刪除
// /admin/blogs/${id}
router.delete('/:id', async(req, res, next) => {
  try {
    const blog = await getBlog(req)
    // const count = await Chapter.count({ where: { courseId: req.params.id } });
    // if (count > 0) throw new Error('當前課程存在章節，無法刪除。');
    await blog.destroy()
    success(res, '刪除文章成功')
  } catch(e) {
    failure(res, e)
  }
});

/**
 * 公共方法: 关联分类、用户数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition(){
  return {
    // attributes: { exclude: ['CategoryId', 'UserId'] },
    include: [
      {
        model: BlogCategory,
        as: 'blogCategory',
        attributes: ['id', 'name']
      },
      // {
      //   model: User,
      //   as: 'user',
      //   attributes: ['id', 'username', 'avatar']
      // }
    ]
  }
}


/**
 * 公共方法：透過id取得單筆資料
 * @param req
 * @returns {Promise<Blog>}
 */
async function getBlog(req){
  
  // 查询當前文章
  const { id } = req.params;

  const condition = getCondition()
  const blog = await Blog.findByPk(id,condition);

  // 如果没有找到, 就抛出异常
  if (!blog) throw new NotFoundError(`ID: ${id} 的文章未找到。`);

  return blog;
}

/**
 * 公共方法：過濾參數
 * @param req
 */

function filterBody(req){
  return {
    blog_category_id: req.body.blogCategoryId,
    title: req.body.title,
    content: req.body.content
    // userId: req.body.userId,
    // image: req.body.image,
    // recommended: req.body.recommended,
    // introductory: req.body.introductory,
  };
}

module.exports = router;