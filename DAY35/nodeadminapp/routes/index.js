var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');

//passport 객체 참조
const passport = require('passport');

// Model영역에서 db객체 참조하기
var db = require('../models/index');

// 미들웨어 참조
// const { isLoggedIn, isNotLoggedIn } = require('./sessionMiddleware');
const { isLoggedIn, isNotLoggedIn } = require('./passportMiddleware');

/* GET home page. */

// 메인 페이지 요청 및 응답
router.get('/', isLoggedIn, function (req, res, next) {
  // 현재 로그인한 사용자 세션 정보 추출하기

  // case1: 일반 세션 기반 로그인 사용자 정보 추출하기
  // if (req.session.loginUser) {
  //   const admin_id = req.session.loginUser.admin_id;
  // }

  // case2: passport기반 로그인 사용자 세션 정보 추출하기
  const admin_id = req.session.passport.user.admin_id;
  res.render('index');
});

// 로그인 웹페이지 요청 및 응답
router.get('/login', isNotLoggedIn, function (req, res, next) {
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

      // 관리자 로그인 여부 세션 속성 추가하기
      req.session.isLogin = true;

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

router.post('/passportLogin', async (req, res, next) => {
  // passport기반 로그인 인증처리 메서드 호출하여 로그인 실시
  // passport.authenticate('로그인전략=local', 패스포트 로그인 후 수행되는 콜백함수=done);
  passport.authenticate('local', (authError, admin, info) => {
    // 패스포트 인증 시 에러가 발생한 경우 에러값 반환됨.
    if (authError) {
      console.log(authError);
      return next(authError);
    }

    // 로컬전략 파일에서 전달된 관리자 세션데이터가 전달이 안된 경우
    // (아이디나 암호가 일치하지 않는 경우 done('', false)처럼 두번째 매개변수가 false로 전달됨..)
    if (!admin) {
      // flash패키지 설치 필요: flash - 서버기반 특정 페이지 이동 직전 특정 데이터를 전달해주고 싶을 때 사용
      // req.flash('키 이름', 값);
      req.flash('loginError', info.message);
      return res.redirect('/login');
    }

    // 정상적으로 passport 인증이 완료된 경우
    // req.login('세션으로 저장할 사용자 데이터', 처리결과 콜백함수(login실행시 발생한 에러가 인수로 전달됨)) - passport 기반 정상 인증이 완료되면 passport 세션을 생성해주는 기능제공
    return req.login(admin, (loginError) => {
      if (loginError) {
        console.log(loginError);
        return next(loginError);
      }

      // 정상적으로 세션 데이터가 세션에 반영된 경우
      return res.redirect('/'); // 메인페이지로 이동
    });
  })(req, res, next);
});

// 사용자 로그아웃 처리 라우팅 메서드
router.get('/logout', isNotLoggedIn, async (req, res, next) => {
  req.logout(function (err) {
    req.session.destroy();
    res.redirect('/login');
  });
});
module.exports = router;
