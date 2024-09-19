let express = require('express');
let router = express.Router();
const { Course,Category,User } = require("../../models")
const { Op } = require('sequelize')
const { NotFoundError,success,failure } = require("../../untils/response")

// 一般搜尋 => 模糊查詢 => 分頁搜尋
//admin/courses
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
      // include: [
      //   {
      //     model: Category
      //   },
      //   {
      //     model: User
      //   }
      // ],
      // exclude,排除不要的欄位
      ...getCondition(),
      order:[['id','DESC']],
      limit:pageSize,
      offset:offset
    }
    
    if (query.categoryId) {
      condition.where = {
        categoryId: {
          [Op.eq]: query.categoryId
        }
      };
    }
    
    if (query.userId) {
      condition.where = {
        userId: {
          [Op.eq]: query.userId
        }
      };
    }
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`
        }
      };
    }
    if (query.recommended) {//推薦課程
      condition.where = {
        recommended: {
          // 需要转布尔值
          [Op.eq]: query.recommended === 'true'
        }
      };
    }
    if (query.introductory) {//入門課程
      condition.where = {
        introductory: {
          [Op.eq]: query.introductory === 'true'
        }
      };
    }

    // count是表全部的總數,row是分頁查詢出的資料
    const {count ,rows} = await Course.findAndCountAll(condition)
    success(res,'查詢文章列表成功' ,{
      count,
      data:rows, 
    })
  }catch(e){
    failure(res,e)
  }
})

// 取得單筆
//admin/courses/${id}
router.get('/:id', async(req, res, next)=>{
  try{
    const course = await getCourse(req)
    success(res,'查詢文章列表成功' ,{data:course})
  }catch(e){
    failure(res,e)
  }
});

//新增
//admin/courses
router.post('/', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const course = await Course.create(body)
    success(res,'創建文章成功' , {
      data:course,
      code:201
    })
   
  }catch(e){
    console.log('我是錯誤e',e);
    failure(res,e)
  }
});

//更新
//admin/courses/${id}
router.put('/:id', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const course = await getCourse(req)
    await course.update(body)
    success(res,'更新文章成功')
    
  }catch(e){
    failure(res,e)
  }
});

// 刪除
// /admin/courses/${id}
router.delete('/:id', async(req, res, next) => {
  try {
    const course = await getCourse(req)
    await course.destroy()
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
    attributes: { exclude: ['CategoryId', 'UserId'] },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }
    ]
  }
}


/**
 * 公共方法：透過id取得單筆資料
 * @param req
 * @returns {Promise<Course>}
 */
async function getCourse(req){
  
  // 查询当前文章
  const { id } = req.params;

  const condition = getCondition()
  const course = await Course.findByPk(id,condition);

  // 如果没有找到, 就抛出异常
  if (!course) throw new NotFoundError(`ID: ${id} 的文章未找到。`);

  return course;
}

/**
 * 公共方法：過濾參數
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */

function filterBody(req){
  return {
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content
  };
}

module.exports = router;