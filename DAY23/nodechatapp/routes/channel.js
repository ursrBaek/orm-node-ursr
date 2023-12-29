// 채팅 페이지 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

// Model영역에서 db객체 참조하기
var db = require('../models/index');

const channelList = [
  {
    channel_id: 1,
    channel_name: '거지방',
    channel_desc: '알뜰한 생활방법 꿀팁 공유 채팅방',
  },
  {
    channel_id: 2,
    channel_name: '다이어트방',
    channel_desc: '다이어트 식단 공유 채팅방',
  },
  {
    channel_id: 3,
    channel_name: '오름캠프 스터디',
    channel_desc: '오름캠프 스터디 채팅방',
  },
  {
    channel_id: 4,
    channel_name: '뛰뛰빵빵',
    channel_desc: '전국 빵 맛집 공유 채팅방',
  },
];

// 채팅 웹페이지 GET 요청 - 채팅 웹페이지 응답;
router.get('/', function (req, res, next) {
  res.render('chat', { channelList });
});

module.exports = router;
