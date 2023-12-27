var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ORM 기반 DB연결 정보 참조
var sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memberRouter = require('./routes/member');
var memberAPIRouter = require('./routes/memberAPI');

//dotenv 어플리케이션 환경설정관리 팩키지 참조 및 구성하기
require('dotenv').config();

var app = express();

// mysql과 자동연결처리 및 모델기반 물리 테이블 생성처리제공
// Sequelize 모델과 실제 데이터베이스 테이블 간의 동기화
// (모델을 사용하여 데이터베이스를 자동으로 조정하여 모델과 데이터베이스가 일치하도록 함)
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/member', memberRouter);
app.use('/api/member', memberAPIRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
