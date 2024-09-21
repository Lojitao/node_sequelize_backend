let express = require('express');
let router = express.Router();
const { Chapter,Course } = require("../../models")
const { Op } = require('sequelize')
const { NotFoundError } = require('../../utils/errors');
const { success,failure } = require("../../utils/responses")

// 一般搜尋 => 模糊查詢 => 分頁搜尋
//admin/chapters
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

    if (!query.courseId) throw new Error('获取章节列表失败，课程ID不能为空。');

    const condition = {
      ...getCondition(),
      order:[['rank','ASC'],['id','ASC']],
      limit:pageSize,
      offset:offset
    }

    condition.where = {
      courseId: {
        [Op.eq]: query.courseId
      }
    };

    if(query.title){
      condition.where = {
        title:{
          [Op.like]:`%${query.title}%`
        }
      }
    }
   
    // count是表全部的總數,row是分頁查詢出的資料
    const {count ,rows} = await Chapter.findAndCountAll(condition)
    success(res,'查詢章節列表成功' ,{
      count,
      data:rows, 
    })
  }catch(e){
    failure(res,e)
  }
})

// 取得單筆
//admin/chapters/${id}
router.get('/:id', async(req, res, next)=>{
  try{
    const chapter = await getChapter(req)
    success(res,'查詢章節列表成功' ,{data:chapter})
  }catch(e){
    failure(res,e)
  }
});

//新增
//admin/chapters
router.post('/', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const chapter = await Chapter.create(body)
    success(res,'創建章節成功' , {
      data:chapter,
      code:201
    })
   
  }catch(e){
    console.log('我是錯誤e',e);
    failure(res,e)
  }
});

//更新
//admin/chapters/${id}
router.put('/:id', async(req, res, next)=>{
  try{
    const body = filterBody(req)
    const chapter = await getChapter(req)
    await chapter.update(body)
    success(res,'更新章節成功')
    
  }catch(e){
    failure(res,e)
  }
});

// 刪除
// /admin/chapters/${id}
router.delete('/:id', async(req, res, next) => {
  try {
    const chapter = await getChapter(req)
    await chapter.destroy()
    success(res, '刪除章節成功')
  } catch(e) {
    failure(res, e)
  }
});

/**
 * 公共方法：透過id取得單筆資料
 * @param req
 * @returns {Promise<Chapter>}
 */
async function getChapter(req){
  
  // 查询当前章節
  const { id } = req.params;
  const condition = getCondition()
  
  const chapter = await Chapter.findByPk(id,condition);

  // 如果没有找到, 就抛出异常
  if (!chapter) throw new NotFoundError(`ID: ${id} 的章節未找到。`);

  return chapter;
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

/**
 * 公共方法: 关联分类、用户数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition(){
  return {
    // attributes: { exclude: ['CategoryId'] },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'name']
      }
    ]
  }
}

module.exports = router;