let express = require('express');
let router = express.Router();
const { sequelize,User } = require("../../models")
// const { Op: OpTypes } = require('sequelize');
const { success,failure } = require("../../utils/responses")

/**
 * 統計用戶性別
 * GET /admin/charts/sex
 */
router.get('/sex', async function (req, res) {
  try {
    const male = await User.count({ where: { sex: 0 } });
    const female = await User.count({ where: { sex: 1 } });
    const unknown = await User.count({ where: { sex: 2 } });

    const data = [
      { value: male, name: '男性' },
      { value: female, name: '女性' },
      { value: unknown, name: '未選擇' }
    ];

    success(res, '查詢用戶性別成功。', { data });
  } catch (error) {
    failure(res, error);
  }
});

router.get('/user', async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC"
    );
    console.log('results',results);
    const data = {
      months: results.map(item=>item.month),
      values: results.map(item=>item.value)
    };
    success(res, '查询每月用户数量成功。', { data });
  } catch (err) {
    failure(res, err);
  }
});

module.exports = router;