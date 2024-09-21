const express = require('express');
const router = express.Router();
const { Course, Category, User } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 查询首页数据
 * GET /
 */
router.get('/', async function (req, res) {
  try {
    //banner(推薦課程)
    const recommendedCourses = await Course.findAll({
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar', 'company']
        }
      ],
      where: { recommended: true },
      order: [['id', 'desc']],
      limit: 10
    });
    
    // 人氣課程
    const likesCourses = await Course.findAll({
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      order: [['likesCount', 'desc'], ['id', 'desc']],
      limit: 10
    });

    // 入门课程
    const introductoryCourses = await Course.findAll({
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      where: { introductory: true },
      order: [['id', 'desc']],
      limit: 10
    });

    success(res,'獲取首頁資訊成功',{data:{
      recommendedCourses,
      likesCourses,
      introductoryCourses
    }})
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;

