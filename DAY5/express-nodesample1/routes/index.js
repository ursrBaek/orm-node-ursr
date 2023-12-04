var express = require('express');
var router = express.Router();

/* GET home page. 메인 웹 페이지 요청 및 응답처리 라우팅 메서드 */
// http://localhost:3000 과 같음
router.get('/', function(req, res, next) {
  res.render('index', { title: '화이팅입니다.' });
});

module.exports = router;
