const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const middleAuth = require('./middlewares/admin-auth')//引入中間件
require('dotenv').config()//引入環境變數

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 後臺路由配置
app.use('/admin/articles', middleAuth , adminArticles);
app.use('/admin/category', middleAuth , adminCategory);
app.use('/admin/settings', middleAuth , adminSetting);
app.use('/admin/users',    middleAuth , adminUser);
app.use('/admin/courses',  middleAuth , adminCourse);
app.use('/admin/chapters', middleAuth , adminChapter);
app.use('/admin/charts',   middleAuth , adminChart);
app.use('/admin/auth' , adminAuth);


module.exports = app;
