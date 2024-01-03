// 채팅 페이지 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

// Model영역에서 db객체 참조하기
var db = require('../models');

// 채팅 웹페이지 GET 요청 - 채팅 웹페이지 응답;
router.get('/', function (req, res, next) {
  res.render('chat', { layout: false });
});

module.exports = router;
