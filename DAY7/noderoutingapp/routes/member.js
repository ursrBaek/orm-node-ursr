var express = require('express');
var router = express.Router();

// 약관동의
router.get('/join', function (req, res) {
  
  res.render('member/join.ejs');
})

// 회원가입
router.get('/entry', function (req, res) {
  
  res.render('member/entry.ejs');
})

// 회원가입 처리
router.post('/entry', function (req, res) {
  
  res.redirect('/main');
})

module.exports = router;