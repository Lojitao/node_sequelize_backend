const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const adminMiddleAuth = require('./middlewares/admin-auth')//引入中間件
const userMiddleAuth = require('./middlewares/user-auth')//引入中間件
// const cors = require('cors')//引入cors套件
require('dotenv').config()//引入環境變數

//前台路由文件
const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapter');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
const likeRouter = require('./routes/like')

// 後臺路由文件
const adminArticles = require('./routes/admin/articles');
const adminCategory = require('./routes/admin/categories');
const adminSetting = require('./routes/admin/settings');
const adminUser = require('./routes/admin/users');
const adminCourse = require('./routes/admin/courses');
const adminChapter = require('./routes/admin/chapter');
const adminChart = require('./routes/admin/chart');
const adminAuth = require('./routes/admin/auth');


const app = express();

// 中間件：記錄請求的完整路徑和方法
app.use((req, res, next) => {
  const log = `Received request: ${req.method} ${req.protocol}://${req.headers.host}${req.originalUrl}`;
  console.log(log); // 日誌記錄到控制台
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// const allowOrigin ={// 白名單：可發請求的域名
//   origin: function (origin, callback) {
//     // 白名單域名
//     const whitelist = [
//       'https://clwy.cn',
//       'http://127.0.0.1:5500',
//       'http://127.0.0.1:5173',
//       'http://localhost:5173'
//     ];
//     // 檢查是否在白名單內，或請求為空（某些情況下本地請求會空值 origin）
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }
// app.use(cors(allowOrigin))//ＣCORS配置，位置一定要放在路由上面！！！



// 前台路由配置
app.use('/api', indexRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/chapters', chaptersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/search', searchRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userMiddleAuth , usersRouter);
app.use('/api/like', userMiddleAuth ,likeRouter);


// 後臺路由配置
app.use('/api/admin/articles', adminMiddleAuth , adminArticles);
app.use('/api/admin/category', adminMiddleAuth , adminCategory);
app.use('/api/admin/settings', adminMiddleAuth , adminSetting);
app.use('/api/admin/users',    adminMiddleAuth , adminUser);
app.use('/api/admin/courses',  adminMiddleAuth , adminCourse);
app.use('/api/admin/chapters', adminMiddleAuth , adminChapter);
app.use('/api/admin/charts',   adminMiddleAuth , adminChart);
app.use('/api/admin/auth' , adminAuth);


module.exports = app;
