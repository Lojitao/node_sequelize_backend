var express = require('express');
var router = express.Router();

/* GET home page. */
// 不需渲染畫面
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// 要回傳JSON格式
router.get('/', function(req, res, next) {
  res.json({ message: 'Hello Express' });
});

module.exports = router;
