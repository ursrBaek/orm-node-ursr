var express = require('express');
var router = express.Router();

/* 임시 메인. */
router.get('/', function (req, res, next) {
  res.render('channel/chat', { layout: 'baseLayout' });
  // res.render('channel/chat', { layout: false });
});

// 로그인 페이지 요청 응답
router.get('/login', function (req, res, next) {
  res.render('login');
});

// 로그인 처리 요청 응답
router.post('/login', function (req, res, next) {
  res.redirect('/chat');
});

// 회원가입 페이지 요청 응답
router.get('/entry', function (req, res, next) {
  res.render('entry');
});

// 회원가입 처리 요청 응답
router.post('/entry', function (req, res, next) {
  // step1: 회원가입 페이지에서 사용자가 입력한 회원정보 추출
  const { email, password } = req.body;

  // step2: db신규 회원등록 처리

  // step3: 등록 완료시 로그인 페이지로 이동시키기
  res.redirect('/login');
});

// 비밀번호 찾기 페이지 요청 응답
router.get('/find', function (req, res, next) {
  res.render('find');
});

// 비밀번호 찾기 처리 요청 응답
router.post('/find', function (req, res, next) {
  res.render('find', { email: '', result: 'ok' }); // 사용자를 위해 비밀번호 찾기처리 결과를 알려줌
});

module.exports = router;
