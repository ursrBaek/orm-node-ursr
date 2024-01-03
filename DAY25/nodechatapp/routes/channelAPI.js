// 채널/채팅 정보관리 RESTful API 전용 라우팅 기능 제공

var express = require('express');
var router = express.Router();

const channelList = [
  {
    channel_id: 1,
    community_id: 2,
    channel_code: '친목',
    channel_name: '자바스크립트 스터디',
    channel_img_path: '/image/img.jpg',
    channel_desc: '자바스크립트 스터디 채팅방',
    channel_state_code: 1,
    reg_date: '2023-01-04',
    user_limit: 50,
    reg_member_id: 16,
    edit_date: '2023-01-10',
    edit_member_id: 16,
  },
  {
    channel_id: 2,
    community_id: 2,
    channel_code: '공유',
    channel_name: '알뜰방',
    channel_img_path: '/image/img2.jpg',
    channel_desc: '알뜰한 지출을 공유하는 방',
    channel_state_code: 1,
    user_limit: 60,
    reg_date: '2020-01-04',
    reg_member_id: 14,
    edit_date: '2020-01-10',
    edit_member_id: 14,
  },
  {
    channel_id: 3,
    community_id: 1,
    channel_code: '친목',
    channel_name: '삼합회',
    channel_img_path: '/image/img.jpg',
    channel_desc: '전국을 다스리는 삼합회 채팅방',
    channel_state_code: 0,
    user_limit: 100,
    reg_date: '2020-01-02',
    reg_member_id: 1,
    edit_date: '2020-01-05',
    edit_member_id: 1,
  },
];

// 전체 채널 목록 데이터 조회 GET 요청 - 전체 채널 목록 데이터 응답
router.get('/all', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    apiResult.code = 200;
    apiResult.data = channelList;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }
  res.json(apiResult);
});

// 신규 채널 정보 등록 처리 POST 요청 - 신규 채널 등록 처리
router.post('/create', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const { channel_name, channel_desc } = req.body;

    const savedChannel = {
      channel_id: 1,
      channel_name,
      channel_desc,
      channel_state_code: 1,
      reg_date: '2022-02-11',
      community_id: 1,
      channel_code: '친목',
    };

    apiResult.code = 200;
    apiResult.data = savedChannel;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 기존 채널 정보 데이터 수정처리 POST 요청 - 기존 채널 정보 데이터 수정처리
router.post('/modify', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const { channel_name, channel_desc } = req.body;

    const affectedCnt = 1;

    apiResult.code = 200;
    apiResult.data = affectedCnt;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 기존 채널 정보 데이터 삭제처리 POST 요청 - 기존 채널 정보 삭제 처리
router.post('/delete', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const { id } = req.body;

    const deletedCnt = 1;

    apiResult.code = 200;
    apiResult.data = deletedCnt;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 단일 채널정보 데이터 조회 GET 요청 - 단일 채널정보 데이터 응답
router.get('/:cid', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const channelId = req.params.cid;

    const channel = channelList[channelId - 1] || {
      channel_id: 5,
      channel_name: '아무채널',
      channel_desc: '임시채널입니다.',
    };

    apiResult.code = 200;
    apiResult.data = channel;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

module.exports = router;
