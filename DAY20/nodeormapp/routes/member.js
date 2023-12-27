// 사용자 정보처리를 위한 웹페이지 요청과 응답처리 전용 라우터 파일

var express = require('express');
var router = express.Router();

// Model영역에서 db객체 참조하기
var db = require('../models/index');

// 회원가입 웹페이지 요청 및 응답처리
router.get('/entry', async function (req, res, next) {
  res.render('member/entry.ejs');
});

// 회원가입 처리 응답처리
router.post('/entry', async (req, res, next) => {
  // step1: 회원가입정보 추출하기
  const { email, password } = req.body;

  // step2: 데이터베이스에 저장할 데이터를 만든다.
  // DB에 전달되는 JSON데이터의 속성명은 반드시 해당 데이터모델(models/member.js)의 속성명과 동일해야한다.
  const member = {
    email,
    password,
  };

  // step3: db에 저장하고 저장된 값을 반환 받는다.
  // db.Member.create()는 ORM 프레임워크에 의해 백엔드에서
  // INSERT INTO members(email, password, createdAt)Values('사용자입력메일주소', '암호'); SQL쿼리가 만들어져서
  // MYSQL DB서버로 전달되어 데이터가 입력되고 입력된 데이터를 MYSQL서버에서 반환해준다.
  var savedMember = await db.Member.create(member);
  res.redirect('/');
});

// 로그인 웹페이지 요청 및 응답처리
router.get('/login', async function (req, res, next) {
  res.render('member/login.ejs', { resultMsg: '', email: '', password: '' });
});

// 로그인 처리 응답처리
router.post('/login', async function (req, res, next) {
  // step1: 사용자 로그인 정보 추출하기
  const { email, password } = req.body;

  // step2: DB members테이블에서 동일한 메일주소의 단일 사용자 정보 조회
  // db.Member.findOne(해당 컬럼과 동일한 조건설정) ORM메소드는
  // SELECT * FROM members WHERE email='사용자입력메일주소값'; 의 SQL구문을 백엔드 환경에서 동적으로 만들어서
  // MYSQL 서버로 전달해 실행하고 조회 결과물을 반환받는다.
  const member = await db.Member.findOne({ where: { email } });

  // step3: 로그인 처리 로직 구현
  var resultMsg = '';

  if (member == null) {
    resultMsg = '동일한 메일주소가 존재하지 않습니다.';
  } else {
    // DB서버에 저장되어 조회된 암호값과 사용자가 입력한 암호값이 일치하면
    if (member.password == password) {
      res.redirect('/');
    } else {
      resultMsg = '암호가 일치하지 않습니다.';
    }
  }

  if (resultMsg) {
    res.render('member/login.ejs', { resultMsg, email, password });
  }
});

module.exports = router;
