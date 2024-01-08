// 회원 정보관리 RESTful API 전용 라우팅 기능 제공
// http://localhost:3000/api/member/~

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
    const memberList = await Member.find({});
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

router.post('/entry', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: null,
    result: '',
  };

  try {
    const { name, member_password, telephone, email, birth_date } = req.body;

    const newMember = {
      name,
      member_password,
      telephone,
      email,
      profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
      entry_type_code: 1,
      use_state_code: 1,
      birth_date,
      reg_date: Date.now(),
      reg_member_id: 2,
    };

    const existingUser = await Member.findOne({ email });

    if (existingUser) {
      apiResult.code = 409;
      apiResult.data = email;
      apiResult.result = 'duplicatedEmail';
    } else {
      const member = await Member.create(newMember);

      apiResult.code = 200;
      apiResult.data = member;
      apiResult.result = 'ok';
    }
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  }

  res.json(apiResult);
});

router.post('/login', async function (req, res) {
  var apiResult = {
    code: 200,
    data: null,
    result: '',
  };
  try {
    const { email, member_password } = req.body;

    const member = await Member.findOne({ email, member_password });

    apiResult.code = 200;
    apiResult.data = member;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  }

  res.json(apiResult);
});

router.post('/create', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: null,
    result: '',
  };

  try {
    const { name, member_password, telephone, email, birth_date } = req.body;

    const newMember = {
      name,
      member_password,
      telephone,
      email,
      profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
      entry_type_code: 1,
      use_state_code: 1,
      birth_date,
      reg_date: Date.now(),
      reg_member_id: 2,
    };

    const existingUser = await Member.findOne({ email });

    if (existingUser) {
      apiResult.code = 409;
      apiResult.data = email;
      apiResult.result = 'duplicatedEmail';
    } else {
      const member = await Member.create(newMember);

      apiResult.code = 200;
      apiResult.data = member;
      apiResult.result = 'ok';
    }
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  }

  res.json(apiResult);
});

router.post('/find', async function (req, res) {
  var apiResult = {
    code: 200,
    data: null,
    result: '',
  };

  try {
    const { name, email, birth_date, telephone } = req.body;

    const member = await Member.findOne({ name, email, birth_date, telephone });

    if (member) {
      apiResult.code = 200;
      apiResult.data = member.member_password;
      apiResult.result = 'ok';
    } else {
      apiResult.code = 404;
      apiResult.data = null;
      apiResult.result = '입력하신 회원정보가 존재하지 않습니다.';
    }
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  }

  res.json(apiResult);
});

// 기존 회원 정보 데이터 수정처리 POST 요청 - 기존 회원 정보 데이터 수정처리
router.post('/modify', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const member_id = req.query.mid;

    const { name, member_password, telephone, email, birth_date } = req.body;

    const editedMember = {
      name,
      member_password,
      telephone,
      email,
      birth_date,
      edit_date: Date.now(),
      edit_member_id: 3,
    };

    const updateResult = await Member.updateOne({ member_id }, editedMember);

    apiResult.code = 200;
    apiResult.data = updateResult.modifiedCount;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 기존회원 정보 데이터 삭제처리 POST 요청 - 기존 회원 정보 삭제 처리
router.delete('/:mid', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const member_id = req.params.mid;

    const deleteResult = await Member.deleteOne({ member_id });

    apiResult.code = 200;
    apiResult.data = deleteResult.deletedCount;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 단일 회원정보 데이터 조회 GET 요청 - 단일 회원정보 데이터 응답
router.get('/:mid', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: null,
    result: 'ok',
  };

  try {
    const member_id = req.params.mid;

    const member = await Member.findOne({ member_id });

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
