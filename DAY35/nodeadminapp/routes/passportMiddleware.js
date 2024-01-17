// 사용자 로그인 여부 체크하고 로그아웃상태에서의 요청시 로그인 페이지로 이동.
// 로그인 상태에서만 호출돼야하는 라우팅메서드에서 사용할 미들웨어.
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // 로그인 상태에서의 요청이면 요청한 라우팅 메서드 호출
    next();
  } else {
    // 로그인 하지 않은 상태에서의 요청이면 로그인페이지로 리다이렉트
    res.redirect('/login');
  }
};

// 로그아웃상태인 경우 특정 페이지로 이동시키기
// 이미 로그인된 상태에서 회원가입 페이지를 요청하면 특정 페이지(메인페이지)로 이동시키기
// 로그아웃 상태에서만 요청한 라우팅 실행
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // 로그아웃 상태에서의 요청이면 요청한 라우팅 메서드 호출
    next();
  } else {
    // 로그인 상태에서의 요청이면 메인페이지로 리다이렉트
    res.redirect('/');
  }
};
