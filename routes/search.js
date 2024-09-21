const express = require('express');
const router = express.Router();
const { Course } = require('../models');
const { Op } = require('sequelize')
const { success, failure } = require('../utils/responses');

/**
 * 搜尋匡
 * GET
 */
router.get('/', async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    };

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${ query.name }%`
        }
      };
    }

    const { count, rows } = await Course.findAndCountAll(condition);
    success(res, '搜索課程成功。',{
      data:rows,
      count
    });

  } catch (error) {
    failure(res, error);
  }
});


module.exports = router