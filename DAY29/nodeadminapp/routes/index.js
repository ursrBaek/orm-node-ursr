var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');

// Model영역에서 db객체 참조하기
var db = require('../models/index');

/* GET home page. */

// 메인 페이지 요청 및 응답
router.get('/', function (req, res, next) {
  res.render('index');
});

// 로그인 웹페이지 요청 및 응답
router.get('/login', function (req, res, next) {
  res.render('login', { resultMsg: '', admin_id: '', admin_password: '', layout: false });
});

router.post('/login', async function (req, res, next) {
  const { admin_id, admin_password } = req.body;

  const admin_member = await db.Admin.findOne({ where: { admin_id } });

  if (admin_member) {
    const isPasswordMatched = await bcrypt.compare(admin_password, admin_member?.admin_password);
    if (isPasswordMatched) {
      res.redirect('/');
    }
  } else {
    res.render('login', {
      resultMsg: '이메일 또는 비밀번호를 잘못 입력하셨습니다.',
      admin_id,
      admin_password,
      layout: false,
    });
  }
});
module.exports = router;
