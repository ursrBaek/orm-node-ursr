var express = require('express');
var router = express.Router();

// 채팅 메인 웹페이지 요청 및 응답 처리 라우팅 메소드
router.get('/', function (req, res, next) {
  res.render('channel/chat', { layout: 'baseLayout' });
  // res.render('channel/chat', { layout: false });
});

module.exports = router;
