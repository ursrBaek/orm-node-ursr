// 회원 정보관리 RESTful API 전용 라우팅 기능 제공

var express = require('express');
var router = express.Router();

const Member = require('../schemas/member');

// 전체 회원목록 데이터 조회 GET 요청 - 전체 회원 목록 데이터 응답
router.get('/all', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const memberList = await db.Member.findAll();
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
router.post('/create', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: null,
    result: '',
  };

  // try {
  //   const { name, member_password, telephone, email, birth_date } = req.body;

  //   let birthDateStr = birth_date.split('-').join('').substr(2);

  //   const newMember = {
  //     name,
  //     member_password,
  //     telephone,
  //     email,
  //     profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
  //     entry_type_code: 1,
  //     use_state_code: 1,
  //     birth_date: birthDateStr,
  //     reg_date: Date.now(),
  //     reg_member_id: 2,
  //   };

  //   const member = await db.Member.create(newMember);

  //   apiResult.code = 200;
  //   apiResult.data = member;
  //   apiResult.result = 'ok';
  // } catch (err) {
  //   apiResult.code = 500;
  //   apiResult.data = null;
  //   apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  // }

  res.json(apiResult);
});

router.post('/entry', async function (req, res, next) {
  var apiResult = {
    code: 200,
    data: null,
    result: '',
  };

  // try {
  //   const { name, member_password, telephone, email, birth_date } = req.body;

  //   let birthDateStr = birth_date.split('-').join('').substr(2);

  //   const newMember = {
  //     name,
  //     member_password,
  //     telephone,
  //     email,
  //     profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
  //     entry_type_code: 1,
  //     use_state_code: 1,
  //     birth_date: birthDateStr,
  //     reg_date: Date.now(),
  //     reg_member_id: 2,
  //   };

  //   const member = await db.Member.create(newMember);

  //   apiResult.code = 200;
  //   apiResult.data = member;
  //   apiResult.result = 'ok';
  // } catch (err) {
  //   apiResult.code = 500;
  //   apiResult.data = null;
  //   apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  // }

  res.json(apiResult);
});

// 기존 회원 정보 데이터 수정처리 POST 요청 - 기존 회원 정보 데이터 수정처리
router.post('/modify/:mid', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  // try {
  //   const member_id = req.params.mid;

  //   const { name, member_password, telephone, email, birth_date } = req.body;

  //   let birthDateStr = birth_date.split('-').join('').substr(2);

  //   const editedMember = {
  //     name,
  //     member_password,
  //     telephone,
  //     email,
  //     profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
  //     entry_type_code: 1,
  //     use_state_code: 1,
  //     birth_date: birthDateStr,
  //     edit_date: Date.now(),
  //     reg_member_id: 2,
  //   };

  //   const updatedCount = await db.Member.update(editedMember, { where: member_id });

  //   apiResult.code = 200;
  //   apiResult.data = updatedCount;
  //   apiResult.result = 'ok';
  // } catch (err) {
  //   apiResult.code = 500;
  //   apiResult.data = null;
  //   apiResult.result = 'Failed';
  // }

  res.json(apiResult);
});

// 기존회원 정보 데이터 삭제처리 POST 요청 - 기존 회원 정보 삭제 처리
router.post('/delete', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  // try {
  //   const { member_id } = req.query.mid;

  //   const deletedCnt = await db.Member.destroy({ where: member_id });

  //   apiResult.code = 200;
  //   apiResult.data = deletedCnt;
  //   apiResult.result = 'ok';
  // } catch (err) {
  //   apiResult.code = 500;
  //   apiResult.data = null;
  //   apiResult.result = 'Failed';
  // }

  res.json(apiResult);
});

// 단일 회원정보 데이터 조회 GET 요청 - 단일 회원정보 데이터 응답
router.get('/:mid', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  // try {
  //   const member_id = req.params.mid;

  //   const member = await db.Member.findOne({ where: { member_id } });

  //   apiResult.code = 200;
  //   apiResult.data = member;
  //   apiResult.result = 'ok';
  // } catch (err) {
  //   apiResult.code = 500;
  //   apiResult.data = null;
  //   apiResult.result = 'Failed';
  // }

  res.json(apiResult);
});
module.exports = router;
