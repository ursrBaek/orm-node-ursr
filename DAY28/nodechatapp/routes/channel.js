// 채팅 페이지 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

// 채팅 웹페이지 GET 요청 - 채팅 웹페이지 응답;
router.get('/', function (req, res, next) {
  res.render('chat', { layout: false });
});

module.exports = router;
