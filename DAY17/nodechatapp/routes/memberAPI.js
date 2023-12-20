// 회원 정보관리 RESTful API 전용 라우팅 기능 제공

var express = require('express');
var router = express.Router();

const memberList = [
  {
    member_id: 1,
    member_password: '1234',
    email: 'momo@naver.com',
    name: '모모',
    telephone: '010131311',
    birth_date: '1991.11.11',
    use_state_code: 1,
    reg_date: '2021-11-22',
  },
  {
    member_id: 2,
    member_password: '1234',
    email: 'jojo@naver.com',
    name: '조조',
    telephone: '010222222',
    birth_date: '1991.11.12',
    use_state_code: 0,
    reg_date: '2021-11-23',
  },
  {
    member_id: 3,
    member_password: '1234',
    email: 'toto@naver.com',
    name: '토토',
    telephone: '010333333',
    birth_date: '1991.11.14',
    use_state_code: 1,
    reg_date: '2021-11-24',
  },
];

// 전체 회원목록 데이터 조회 GET 요청 - 전체 회원 목록 데이터 응답
router.get('/all', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    apiResult.code = 200;
    apiResult.data = memberList;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }
  res.json(apiResult);
});

// 신규 회원 정보 등록 처리 POST 요청 - 신규 회원 등록 처리
router.post('/create', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };
  try {
    const { name, telephone, email } = req.body;

    const savedMember = {
      member_id: 1,
      member_password: '1234',
      email,
      name,
      telephone,
      birth_date: '1991.11.11',
      use_state_code: 1,
      reg_date: '2021-11-22',
    };

    apiResult.code = 200;
    apiResult.data = savedMember;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 기존 회원 정보 데이터 수정처리 POST 요청 - 기존 회원 정보 데이터 수정처리
router.post('/modify', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const { name, telephone, email } = req.body;

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

// 기존회원 정보 데이터 삭제처리 POST 요청 - 기존 회원 정보 삭제 처리
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

// 단일 회원정보 데이터 조회 GET 요청 - 단일 회원정보 데이터 응답
router.get('/:mid', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const memberId = req.params.cid;

    const member = memberList[memberId - 1] || {
      member_id: 100,
      member_password: '1234',
      email: 'momo@naver.com',
      name: '단일조회멤버',
      telephone: '010131311',
      birth_date: '1991.11.11',
      use_state_code: 1,
      reg_date: '2021-11-22',
    };

    apiResult.code = 200;
    apiResult.data = member;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});
module.exports = router;
