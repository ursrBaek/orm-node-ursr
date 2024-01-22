var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');

const flash = require('connect-flash');

require('dotenv').config();

const session = require('express-session');
const passport = require('passport');

//인증관련 패스포트 개발자 정의 모듈참조, 로컬 로그인 전략 적용
const passportConfig = require('./passport/index.js');

//패스포트 설정처리
passportConfig(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var adminRouter = require('./routes/admin');
var articleRouter = require('./routes/article');
var channelRouter = require('./routes/channel');
const memberRouter = require('./routes/member');
const messageRouter = require('./routes/message');

var sequelize = require('./models/index.js').sequelize;

var app = express();

app.use(flash());

sequelize.sync();

// express-session기반 서버세션 설정 구성하기
app.use(
  session({
    resave: false, // 매번 세션 강제 저장 할건지 - 로그인시마다 세션구조/데이터 변경 없이도 다시저장여부 체크
    saveUninitialized: true, // 빈 세션도 저장할지여부. 기본 false
    secret: process.env.COOKIE_SECRET, // 암호화할 때 사용하는 salt값
    cookie: {
      httpOnly: true, // javascript로 cookie에 접근하지 못하게 하는 옵션
      secure: false, // https 환경에서만 session 정보를 주고받도록 처리
      maxAge: 1000 * 60 * 5, //5분동안 서버세션을 유지하겠다.(1000은 1초)
    },
  }),
);

//패스포트-세션 초기화 : express session 뒤에 설정
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/admin', adminRouter);
app.use('/article', articleRouter);
app.use('/channel', channelRouter);
app.use('/member', memberRouter);
app.use('/message', messageRouter);
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
