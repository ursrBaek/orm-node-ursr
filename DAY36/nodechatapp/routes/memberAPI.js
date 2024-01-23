// 회원 정보관리 RESTful API 전용 라우팅 기능 제공

var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const AES = require('mysql-aes');

const jwt = require('jsonwebtoken');

// Model영역에서 db객체 참조하기
var db = require('../models/index');

// 사용자 토큰 제공여부 체크 미들웨어 참조하기
const { tokenAuthChecking } = require('./apiMiddleware');

// 각종 열거형 상수 참조하기
const constants = require('../common/enum');

// 전체 회원목록 데이터 조회 GET 요청 - 전체 회원 목록 데이터 응답
router.get('/all', tokenAuthChecking, async function (req, res, next) {
  const apiResult = {
    code: 400,
    data: [],
    result: '',
  };

  try {
    const memberList = await db.Member.findAll({
      attributes: ['member_id', 'email', 'name', 'profile_img_path', 'telephone'],
      where: {
        use_state_code: constants.USE_STATE_CODE_USED,
      },
    });
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

  try {
    const { name, member_password, telephone, email, birth_date } = req.body;

    let birthDateStr = birth_date.split('-').join('').substr(2);

    const newMember = {
      name,
      member_password,
      telephone,
      email,
      profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
      entry_type_code: 1,
      use_state_code: 1,
      birth_date: birthDateStr,
      reg_date: Date.now(),
      reg_member_id: 2,
    };

    const member = await db.Member.create(newMember);

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

router.post('/login', async (req, res) => {
  var apiResult = {
    code: 200,
    data: null,
    result: '',
  };

  try {
    const { email, member_password } = req.body;

    const member = await db.Member.findOne({ where: { email } });
    let resultMsg = '';

    if (member) {
      const isPasswordMatched = await bcrypt.compare(member_password, member?.member_password);
      if (isPasswordMatched) {
        member.member_password = '';
        member.telephone = AES.decrypt(member.telephone, process.env.MYSQL_AES_KEY);
        resultMsg = 'ok';

        // 인증된 사용자의 기본정보 JWT토큰 생성 발급
        // step 1: JWT토큰에 담을 사용자 정보 생성
        // JWT인증 사용자정보 토큰 값 구조 정의 및 데이터 세팅
        const memberTokenData = {
          member_id: member.member_id,
          email: member.email,
          name: member.name,
          profile_img_path: member.profile_img_path,
          telephone: member.telephone,
        };

        const token = await jwt.sign(memberTokenData, process.env.JWT_SECRET, { expiresIn: '24h', issuer: 'nara' });

        apiResult.code = 200;
        apiResult.data = token;
        apiResult.msg = resultMsg;
      } else {
        resultMsg = 'NotCorrectPassword';
        apiResult.code = 400;
        apiResult.data = null;
        apiResult.msg = resultMsg;
      }
    } else {
      resultMsg = 'NotExistEmail';
      apiResult.code = 404;
      apiResult.data = null;
      apiResult.msg = resultMsg;
    }
  } catch (err) {
    console.log('서버에러- api/member/entry', err.message);
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  }

  res.json(apiResult);
});
router.post('/find', async (req, res) => {
  res.json({});
});

router.post('/entry', async function (req, res, next) {
  var apiResult = {
    code: 200,
    data: null,
    result: '',
  };

  try {
    const { name, member_password, telephone, email } = req.body;

    // 단방향 암호화 해시 알고리즘 적용 사용자 암호 암호화 적용
    const encryptedPassword = await bcrypt.hash(member_password, 12);
    var encryptTelephone = AES.encrypt(telephone, process.env.MYSQL_AES_KEY);

    // 메일주소 중복 체크
    const existMember = await db.Member.findOne({ where: { email } });

    if (existMember) {
      apiResult.code = 400;
      apiResult.data = null;
      apiResult.result = 'ExistedMember';
    } else {
      const newMember = {
        name,
        member_password: encryptedPassword,
        telephone: encryptTelephone,
        email,
        profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
        entry_type_code: 1,
        use_state_code: 1,
        reg_date: Date.now(),
        reg_member_id: 0,
      };

      const registeredMember = await db.Member.create(newMember);

      registeredMember.member_password = '';
      registeredMember.telephone = AES.decrypt(registeredMember.telephone, process.env.MYSQL_AES_KEY);

      apiResult.code = 200;
      apiResult.data = registeredMember;
      apiResult.result = 'ok';
    }
  } catch (err) {
    console.log('서버에러- api/member/entry', err);
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  }

  res.json(apiResult);
});

// 기존 회원 정보 데이터 수정처리 POST 요청 - 기존 회원 정보 데이터 수정처리
router.post('/modify/:mid', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const member_id = req.params.mid;

    const { name, member_password, telephone, email, birth_date } = req.body;

    let birthDateStr = birth_date.split('-').join('').substr(2);

    const editedMember = {
      name,
      member_password,
      telephone,
      email,
      profile_img_path: 'https://www.interpark.com/images/header/nav/icon_special.png',
      entry_type_code: 1,
      use_state_code: 1,
      birth_date: birthDateStr,
      edit_date: Date.now(),
      reg_member_id: 2,
    };

    const updatedCount = await db.Member.update(editedMember, { where: member_id });

    apiResult.code = 200;
    apiResult.data = updatedCount;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 기존회원 정보 데이터 삭제처리 POST 요청 - 기존 회원 정보 삭제 처리
router.post('/delete', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const { member_id } = req.query.mid;

    const deletedCnt = await db.Member.destroy({ where: member_id });

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

// 로그인 한 현재 사용자의 회원 기본정보 조회 API
// 로그인 시 발급한 JWT 토큰은 HTTP Header 영역에 포함되어 전달됨
router.get('/profile', tokenAuthChecking, async (req, res) => {
  var apiResult = {
    code: 400,
    data: null,
    result: '',
  };

  try {
    // step1: 웹브라우저 헤더에서 사용자 JWT 인증 토큰값을 추출한다.
    const token = req.headers.authorization.split('Bearer ')[1];
    const tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);

    const loginMemberId = tokenJsonData.member_id;
    console.log('loginMemberId는~?: ', loginMemberId);

    const dbMember = await db.Member.findOne({
      where: { member_id: loginMemberId },
      attributes: ['profile_img_path', 'name', 'email', 'telephone', 'birth_date'],
    });

    dbMember.telephone = AES.decrypt(dbMember.telephone, process.env.MYSQL_AES_KEY);

    apiResult.code = 200;
    apiResult.data = dbMember;
    apiResult.result = 'member profile ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  }

  res.json(apiResult);
});

// 단일 회원정보 데이터 조회 GET 요청 - 단일 회원정보 데이터 응답
router.get('/:mid', async function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const member_id = req.params.mid;

    const member = await db.Member.findOne({ where: { member_id } });

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
