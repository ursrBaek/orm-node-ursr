var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');

// Model영역에서 db객체 참조하기
var db = require('../models/index');

/* GET home page. */

// 메인 페이지 요청 및 응답
router.get('/', function (req, res, next) {
  // 현재 로그인한 사용자 세션 정보 추출하기
  const admin_id = req.session.loginUser.admin_id;
  res.render('index');
});

// 로그인 웹페이지 요청 및 응답
router.get('/login', function (req, res, next) {
  res.render('login', { resultMsg: '', admin_id: '', admin_password: '', layout: false });
});

router.post('/login', async function (req, res, next) {
  const { admin_id, admin_password } = req.body;

  const admin_member = await db.Admin.findOne({ where: { admin_id } });

  if (admin_member) {
    const isPasswordMatched = await bcrypt.compare(admin_password, admin_member?.admin_password);
    // id/pw 일치하는 사용자인 경우
    if (isPasswordMatched) {
      // 해당 사용자의 주요정보를 세션에 저장
      // 서버에 메모리공간에 저장할 로그인 사용자의 세션정보 구조 및 데이터 바인딩
      const sessionLoginData = {
        admin_member_id: admin_member.admin_member_id,
        company_code: admin_member.company_code,
        admin_id: admin_member.admin_id,
        admin_name: admin_member.admin_name,
      };

      // req.session에 동적으로 loginUser 속성을 추가해서 값으로 세션로그인데이터 값을 세팅
      req.session.loginUser = sessionLoginData;

      // 세션 저장 후 '/'위치로 이동. 반드시 req.session.save()메소드를 호출해서 req.session에 동적으로 추가한 속성을 저장해야함.
      // save()호출과 동시에 쿠키 파일이 서버에서 생성되고 생성된 쿠키파일이
      // 현재 사용자 웹브라우저에 전달되어 저장됨.
      // 저장된 쿠키파일은 이후 해당 사이트에 요청을 할 떄마다 함께 전달됨.
      // 전달된 쿠키 정보로 서버메모리상의 세션정보를 이용해 로그인한 사용자정보를 추출함.
      req.session.save(function () {
        res.redirect('/');
      });
    }
  } else {
    res.render('login', {
      resultMsg: '이메일 또는 비밀번호를 잘못 입력하셨습니다.',
      admin_id,
      admin_password,
      layout: false,
    });
  }
});
module.exports = router;
