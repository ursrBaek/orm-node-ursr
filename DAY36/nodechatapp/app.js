var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUI = require('swagger-ui-express');
var swaggerJsDoc = require('swagger-jsdoc');

// 환경설정파일 호출하기: 전역정보로 설정됩니다.
// 호출위치는 반드시 app.js내 최상위에서 호출할 것....
require('dotenv').config();

const cors = require('cors');

var sequelize = require('./models/index.js').sequelize;

// express-ejs-layouts 패키지 참조
var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var channelRouter = require('./routes/channel');
var channelAPIRouter = require('./routes/channelAPI');
var memberAPIRouter = require('./routes/memberAPI');

var app = express();

//mysql과 자동연결처리 및 모델기반 물리 테이블 생성처리제공
sequelize.sync();

// 모든 도메인 api 요청 허용
// app.use(cors());

//특정 도메인주소만 허가
app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    origin: ['http://localhost:3005', 'http://naver.com'],
  }),
);

// api 문서에 대한 설정
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Member API',
      version: '1.0.0',
      description: 'Chat app의 member API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//레이아웃 설정
app.set('layout', 'layout'); // 해당 노드앱의 모든 콘텐츠 뷰파일의 기본 레이아웃ejs파일 설정하기
app.set('layout extractScripts', true); // 콘텐츠 페이지내 script 태그를 레이아웃에 통합할지 여부
app.set('layout extractStyles', true); // 콘텐츠 페이지내 style 태그를 레이아웃에 통합할지 여부
app.set('layout extractMetas', true); // 콘텐츠 페이지내 meta 태그를 레이아웃에 통합할지 여부
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', channelRouter);
app.use('/api/channel', channelAPIRouter);
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
