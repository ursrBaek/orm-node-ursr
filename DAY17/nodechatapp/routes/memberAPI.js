// 회원 정보관리 RESTful API 전용 라우팅 기능 제공

var express = require('express');
var router = express.Router();

const allUserList = [
  {
    uid: 1,
    nickname: 'nara',
    username: '백나라',
    email: 'nara@naver.com',
  },
  {
    uid: 2,
    nickname: 'coco',
    username: '홍길동',
    email: 'coco@naver.com',
  },
  {
    uid: 3,
    nickname: 'jojo',
    username: '김철수',
    email: 'jojo@naver.com',
  },
];

// 전체 회원목록 데이터 조회 GET 요청 - 전체 회원 목록 데이터 응답
router.get('/all', function (req, res, next) {
  res.json(allUserList);
});

// 신규 회원 정보 등록 처리 POST 요청 - 신규 회원 등록 처리
router.post('/create', function (req, res, next) {
  const { name, email, nickname, password } = req.body;

  const newMember = {
    id: 1,
    name,
    email,
    nickname,
    password,
  };

  // DB에 회원 정보 저장

  res.json(newMember);
});

// 기존 회원 정보 데이터 수정처리 POST 요청 - 기존 회원 정보 데이터 수정처리
router.post('/modify', function (req, res, next) {
  const { name, email, nickname, password } = req.body;

  res.send('member modify ok');
});

// 기존회원 정보 데이터 삭제처리 POST 요청 - 기존 회원 정보 삭제 처리
router.post('/delete', function (req, res, next) {
  const { name, email, nickname, password } = req.body;

  res.send('member delete ok');
});

// 단일 회원정보 데이터 조회 GET 요청 - 단일 회원정보 데이터 응답
router.get('/:mid', function (req, res, next) {
  const memberId = req.params.mid;

  res.json(
    allUserList[memberId] || {
      uid: 1,
      nickname: 'nara',
      username: '백나라',
      email: 'nara@naver.com',
    },
  );
});
module.exports = router;
