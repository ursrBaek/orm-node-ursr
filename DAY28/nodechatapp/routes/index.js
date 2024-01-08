// 공통 페이지 제공(로그인, 회원가입, 암호찾기)
var express = require('express');
var router = express.Router();

// Model영역에서 db객체 참조하기
const Member = require('../schemas/member');

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

  const member = await Member.findOne({ email });

  if (member?.member_password === member_password) {
    res.redirect('/chat');
  } else {
    res.render('login', {
      resultMsg: '이메일 또는 비밀번호를 잘못 입력하셨습니다.',
      email,
      member_password,
    });
  }
});

// 회원가입 웹페이지 GET 요청 - 회원가입 웹페이지 응답
router.get('/entry', function (req, res, next) {
  res.render('entry.ejs');
});

// 회원가입 처리 POST 요청 - 회원가입 처리 후 로그인페이지 이동
router.post('/entry', async function (req, res, next) {
  const { name, member_password, telephone, email, birth_date } = req.body;

  const newMember = {
    name,
    member_password,
    telephone,
    email,
    profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
    entry_type_code: 1,
    use_state_code: 1,
    birth_date,
    reg_date: Date.now(),
    reg_member_id: 2,
  };

  await Member.create(newMember);

  res.render('successMessage', { successMsg: '회원가입이 완료되었습니다.' });
});

// 암호 찾기 웹 페이지 GET 요청 - 암호찾기 웹페이지 응답
router.get('/find', function (req, res, next) {
  res.render('find.ejs', { resultMsg: '', inputValue: {} });
});

// 암호찾기 처리 POST 요청 - 암호 찾기 완료 후 로그인 페이지 이동처리
router.post('/find', async function (req, res, next) {
  const { name, email, birth_date, telephone } = req.body;

  const member = await Member.findOne({ name, email, birth_date, telephone });

  if (member) {
    res.render('successMessage', {
      successMsg: `'${member.name}' 님의 비밀번호는 <b>${member.member_password}</b>입니다.`,
    });
  } else {
    res.render('find.ejs', {
      resultMsg: '입력하신 회원정보가 존재하지 않습니다.',
      inputValue: { name, email, birth_date, telephone },
    });
  }
});

module.exports = router;
