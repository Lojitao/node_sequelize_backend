const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// 後臺路由文件
const adminArticles = require('./routes/admin/articles');
const adminCategory = require('./routes/admin/categories');
const adminSetting = require('./routes/admin/settings');
const adminUser = require('./routes/admin/users');
const adminCourse = require('./routes/admin/courses');
const adminChapter = require('./routes/admin/chapter');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 後臺路由配置
app.use('/admin/articles', adminArticles);
app.use('/admin/category', adminCategory);
app.use('/admin/settings', adminSetting);
app.use('/admin/users', adminUser);
app.use('/admin/courses', adminCourse);
app.use('/admin/chapters', adminChapter);


module.exports = app;
