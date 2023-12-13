// 채널/채팅 정보관리 RESTful API 전용 라우팅 기능 제공

var express = require('express');
var router = express.Router();

const channelList = [
  {
    cid: 1,
    name: '거지방',
    desc: '알뜰한 생활방법 꿀팁 공유 채팅방',
  },
  {
    cid: 2,
    name: '다이어트방',
    desc: '다이어트 식단 공유 채팅방',
  },
  {
    cid: 3,
    name: '오름캠프 스터디',
    desc: '오름캠프 스터디 채팅방',
  },
  {
    cid: 4,
    name: '뛰뛰빵빵',
    desc: '전국 빵 맛집 공유 채팅방',
  },
];

// 전체 채널 목록 데이터 조회 GET 요청 - 전체 채널 목록 데이터 응답
router.get('/all', function (req, res, next) {
  res.json(channelList);
});

// 신규 채널 정보 등록 처리 POST 요청 - 신규 채널 등록 처리
router.post('/create', function (req, res, next) {
  const { name, desc } = req.body;

  console.log('신규 채널 등록 정보: ', name, desc);
  res.send('channel create ok');
});

// 기존 채널 정보 데이터 수정처리 POST 요청 - 기존 채널 정보 데이터 수정처리
router.post('/modify', function (req, res, next) {
  const { name, desc } = req.body;

  res.send('channel modify ok');
});

// 기존 채널 정보 데이터 삭제처리 POST 요청 - 기존 채널 정보 삭제 처리
router.post('/delete', function (req, res, next) {
  const { id } = req.body;

  res.send('channel delete ok');
});

// 단일 채널정보 데이터 조회 GET 요청 - 단일 채널정보 데이터 응답
router.get('/:cid', function (req, res, next) {
  const channelId = req.params.cid;

  res.json(
    channelList[channelId - 1] || {
      cid: channelId,
      name: '채팅방',
      desc: '어쩌고저쩌고',
    },
  );
});

module.exports = router;
