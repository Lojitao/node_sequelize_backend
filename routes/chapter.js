const express = require('express');
const router = express.Router();
const { Course,Chapter,User } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors');

/**
 * 單筆章節詳情及其餘所有章節
 * GET /chapters
 */
router.get('/detail', async function (req, res) {
  try {
    const { cahpterId } = req.query;
    const condition = {
      attributes: { exclude: ['CourseId'] },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname', 'avatar', 'company']
            }
          ]
        }
      ]
    };

    const chapter = await Chapter.findByPk(cahpterId, condition);
    if (!chapter) throw new NotFoundError(`ID: ${cahpterId} 的章節未找到。`);

    // 同屬一個課程的所有章節
    const chapters = await Chapter.findAll({
      attributes: { exclude: ['CourseId', 'content'] },
      where: { courseId: chapter.courseId },
      order: [['rank', 'ASC'], ['id', 'DESC']]
    });

    success(res,'查詢章節成功。', {data:{ chapter, chapters } });
  } catch (error) {
    failure(res, error);
  }
});


module.exports = router;