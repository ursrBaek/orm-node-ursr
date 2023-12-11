// 각종 노드 패키지를 참조합니다.

// 서버상에서 각종 에러가 발생하면 에러처리를 위한 함수를 참조합니다.
var createError = require('http-errors');

// node express 웹 개발 프레임워크를 참조합니다.
var express = require('express');

// path라는 노드 프레임워크의 파일/폴더 경로 정보를 추출하는 패키지를 참조합니다.
var path = require('path');

// 웹서버에서 발급해주는 쿠키파일에 대한 정보를 추출하는 Cookie-parser 패키지를 참조합니다.
var cookieParser = require('cookie-parser');

// morgan이라는 노드패키지를 통해 사용자 이벤트(요청과 응답) 정보를 로깅(이력활동정보 저장)하는 패키지를 참조합니다.
var logger = require('morgan');

// express 기본 라우팅 파일 참조하기
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 개발자가 정의한 라우팅 파일 참조

// express 객체를 이용해 노드 어플리케이션 객체를 생성합니다.
// app은 backend node application 그 자체입니다.
var app = express(); // express를 실행하면 노드 어플리케이션이 만들어짐.

// 개발자 정의 미들웨어 함수기능 구현
// app(노드어플리케이션)이 만들어지고 모든 사용자 요청 발생시 이 미들웨어 함수가 실행됨.
app.use(function (req, res, next) {
  console.log('어플리케이션 미들웨어 함수 호출1: ', Date.now());
  next(); // 다음 미들웨어 흐름으로 넘어가게 함
});

// app 노드 어플리케이션 환경설정을 진행합니다.
// app.set(); 노드 어플리케이션 최초 실행시 서비스 환경 셋팅 처리.

// view engine setup
// MVC패턴기반 각종 view 파일이 존재하는 물리적 views 폴더의 위치를 설정해줍니다.
app.set('views', path.join(__dirname, 'views'));

// MVC에서 사용하는 view엔진 기술로 ejs를 사용한다고 설정합니다.
app.set('view engine', 'ejs');

// app.use()는 미들웨어로 사용자들이 매번 어떠한 요청과 응답을 해오더라도
// 매번 요청이 발생할때마다 실행되는 어플리케이션 미들웨어 함수 기능정의
// 아래의 모든 app.use() 메소드들은 특정 사용자의 요청과 응답이 발생할때마다 실행되는 기능
app.use(logger('dev'));

app.use(express.json()); // 서버의 json 기능 탑재(JSON파일을 파싱할 수 있도록 함)

app.use(express.urlencoded({ extended: false })); // 쿼리스트링에 한글이 들어가거나 하는거 깨지지 않게 해준다거나... 암튼 url 인코딩을 위한 미들웨어

app.use(cookieParser()); // 쿠키 파싱을 위한 미들웨어

app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 서비스를 위한 경로 설정 미들웨어

// 개발자 정의 라우팅 미들웨어
// localhost:3000/user/nara
app.use('/user/:id', function (req, res, next) {
  const uid = req.params.id;
  console.log('어플리케이션 미들웨어 호출2-호출유형: ', req.method);
  res.send('사용자 아이디: ' + uid);
});

// 라우터 파일에 대한 기본 경로 설정
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// 사용자 요청에 대해 요청을 못찾거나 리소스를 못찾으면 404에러를 웹브라우저에 전달해주는 미들웨어 함수
// 대부분 사용자 요청과 응답은 상기 기본 또는 개발자정의 라우터파일에서 처리가 되어지고,
// 처리되지 못한 사용자 요청은 여기 404미들웨어에서 처리됩니다.
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// MVC 패턴 노드백엔드 환경에서의 서버에러 발생시 처리해주는 전역예외처리기 기능 제공
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
