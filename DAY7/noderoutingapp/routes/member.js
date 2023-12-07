var express = require('express');
var router = express.Router();

// 약관동의
router.get('/join', function (req, res) {
  res.render('member/join.ejs');
});

// 회원가입
router.get('/entry', function (req, res) {
  res.render('member/entry.ejs');
});

// 회원가입 처리
router.post('/entry', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const tel = req.body.tel;

  const data = {
    email,
    password,
    name,
    tel,
    entryDate: Date.now(),
  };

  console.log('--------------------------');
  console.log('     클라이언트 입력 데이터:', data);
  console.log('--------------------------');

  res.redirect('/auth/login');
});

module.exports = router;
