const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 查询分类列表
 * GET /categories
 */
router.get('/', async function (req, res) {
  try {
    const categories = await Category.findAll({
      order: [['rank', 'ASC'], ['id', 'DESC']],
    });
    success(res, '查詢分類成功。',{data: categories});
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;