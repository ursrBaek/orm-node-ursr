// 공통 페이지 제공(로그인, 회원가입, 암호찾기)
var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

// Model영역에서 db객체 참조하기
var db = require('../models/index');

router.get('/', function (req, res) {
  res.render('index.ejs', { layout: false });
});

// 로그인 웹페이지 GET 요청 - login 웹페이지 응답
router.get('/login', function (req, res, next) {
  res.render('login.ejs', { resultMsg: '', email: '', member_password: '' });
});

// 로그인처리 POST 요청 - 로그인 처리 및 채팅 페이지 이동
router.post('/login', async function (req, res, next) {
  const { email, member_password } = req.body;

  const member = await db.Member.findOne({ where: { email } });

  if (member) {
    const isPasswordMatched = await bcrypt.compare(member_password, member?.member_password);
    if (isPasswordMatched) {
      res.redirect('/');
    } else {
      res.render('login', {
        resultMsg: '이메일 또는 비밀번호를 잘못 입력하셨습니다.',
        email,
        member_password,
      });
    }
  }
});

// 회원가입 웹페이지 GET 요청 - 회원가입 웹페이지 응답
router.get('/entry', function (req, res, next) {
  res.render('entry.ejs');
});

// 회원가입 처리 POST 요청 - 회원가입 처리 후 로그인페이지 이동
router.post('/entry', async function (req, res, next) {
  const { name, member_password, telephone, email } = req.body;

  const encryptedPassword = await bcrypt.hash(member_password, 12);

  const newMember = {
    name,
    member_password: encryptedPassword,
    telephone,
    email,
    profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
    entry_type_code: 0,
    use_state_code: 1,
    reg_date: Date.now(),
    reg_member_id: 2,
  };

  await db.Member.create(newMember);

  res.redirect('/login');
});

// 암호 찾기 웹 페이지 GET 요청 - 암호찾기 웹페이지 응답
router.get('/find', function (req, res, next) {
  res.render('find.ejs');
});

// 암호찾기 처리 POST 요청 - 암호 찾기 완료 후 로그인 페이지 이동처리
router.post('/find', function (req, res, next) {
  const { email, telephone } = req.body;
  console.log('암호찾기 사용자 입력 정보: ', email, telephone);
  res.redirect('/login');
});

// JWT 토큰 생성 웹페이지 요청과 응답
router.get('/makeToken', async function (req, res, next) {
  let token = '';
  res.render('makeToken.ejs', { token, layout: false });
});

// JWT 토큰 생성하고 토큰 확인하기
router.post('/makeToken', async function (req, res, next) {
  let token = '';

  const { userId, email, name, userType, telephone } = req.body;

  // JWT 토큰에 담을 JSON 데이터 구조 . 및데이터 바인딩
  const jsonTokenData = {
    userId,
    email,
    name,
    userType,
    telephone,
  };

  //  jwt.sign('JSON데이터',토큰인증키,{옵션_유효기간(expiresIn_파기일시),발급자(issuer))})
  // expiresIn 옵션 포맷. 24h - 24시간 뒤, 200d - 200일 뒤, 60m - 60분 뒤
  // 토큰 생성일시를 기준으로 해당 expiresIn의 값 만큼만 유효함.
  token = await jwt.sign(jsonTokenData, process.env.JWT_SECRET, { expiresIn: '24h', issuer: 'nara' });
  res.render('makeToken.ejs', { token, layout: false });
});

// JWT 토큰값 수신하여 토큰값 해석하기
// http://localhost:3000/readToken?token=토큰값
router.get('/readToken', async function (req, res, next) {
  let token = req.query.token;
  let tokenJsonData = {};

  // 토큰의 유효성을 검사하고 JSON 데이터를 추출함
  // await jwt.verify(JWT토큰, 해당토큰생성시 사용한 JWT인증키값);
  try {
    tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    token = '유효하지 않은 토큰입니다.';
  }
  res.render('readToken.ejs', { token, tokenJsonData, layout: false });
});
module.exports = router;
