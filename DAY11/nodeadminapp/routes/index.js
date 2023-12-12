var express = require('express');
var router = express.Router();

/* GET home page. */

// 메인 페이지 요청 및 응답
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 로그인 웹페이지 요청 및 응답
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  const { id, password } = req.body;
  res.redirect('/');
});

module.exports = router;
