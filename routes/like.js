const express = require('express');
const router = express.Router();
const { Course, Like,User } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors');

/**
 * 点赞，取消赞
 * POST /likes
 */
router.post('/', async function (req, res) {
  try {
    const userId = req.userId;
    
    //檢查是否真的有course的id
    const { courseId } = req.body;
    const courseRow = await Course.findByPk(courseId);
    if (!courseRow) throw new NotFoundError('課程不存在。');

    // 检查课程是否已经點讚
    const likeRow = await Like.findOne({
      where: {courseId,userId}
    });
    console.log('有無likeRow',likeRow);
    
    if(!likeRow){
      await Like.create({courseId,userId})
      await courseRow.increment('likesCount')
      success(res, '點讚成功');
    }else{
      await likeRow.destroy()
      await courseRow.decrement('likesCount')
      success(res, '取消讚成功');
    }
  } catch (error) {
    failure(res, error);
  }
});


/**
 * 查詢用戶點讚的課程
 * GET /likes
 */
router.get('/', async function (req, res) {
  try {
    const {pageSize,offset} = getPagination(req.query);
    
    // 查詢當前用戶
    const userRow = await User.findByPk(req.userId);

    // 查詢當前用戶點贊過的課程
    const courseRows = await userRow.getLikeCourses({
      joinTableAttributes: [],
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    });

    // 查詢當前用戶點贊過的課程總數
    const count = await userRow.countLikeCourses();

    success(res,'查詢當前用戶點贊成功' ,{
      count,
      data:courseRows, 
    })
  } catch (error) {
    failure(res, error);
  }
});


function getPagination(query) {
  const currentPage = Math.abs(Number(query.currentPage)) || 1;
  const pageSize = Math.abs(Number(query.pageSize)) || 10;
  const offset = (currentPage - 1) * pageSize;//從第幾筆資料開始找

  return {
    currentPage,
    pageSize,
    offset
  };
}


module.exports = router