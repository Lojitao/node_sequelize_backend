const express = require('express');
const router = express.Router();
const { Course, Like, User } = require('../models');
const { success, failure } = require('../utils/response');
const NotFoundError = require('../utils/errors');

/**
 * 点赞，取消赞
 * POST /likes
 */
router.post('/likes', async function (req, res) {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    //檢查是否真的有course的id
    const courseRow = await Course.findByPk(courseId);
    if (!courseRow) throw new NotFoundError('课程不存在。');

    // 检查课程是否已经點讚
    const likeRow = await Like.findOne({
      where: {
        courseId,
        userId
      }
    });

    if(!likeRow){
      await Like.Course({courseId,userId})
      await courseRow.increment('likeCount')
      success(res, '點讚成功');
    }else{
      await likeRow.destroyed()
      await courseRow.decrement('likeCount')
      success(res, '取消讚成功');
    }
  } catch (error) {
    failure(res, error);
  }
});