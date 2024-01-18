// apiMiddleware.js의 목적
// -> 각종 api 라우터에서 클라이언트 측의 JWT사용자 로그인 인증 토큰이 있는지 체크해서 후행 작업 제어
// apiMiddleware.js 해당 호출 api를 해당 요청사용자가 호출/사용가능한지에 대한 권한체크(인가) 미들웨어

const jwt = require('jsonwebtoken');

exports.tokenAuthChecking = async (req, res, next) => {
  // step1: 발급된 토큰 정보가 존재하지 않을 경우
  if (!req.headers.authorization) {
    const apiResult = {
      code: 400,
      data: null,
      msg: '사용자 인증토큰이 제공되지 않았습니다.',
    };

    return res.json(apiResult);
  }

  // 제공 토큰의 유효성을 체크해서 유효하지 않으면(만료토큰) 튕기고 정상적이면 콜백함수 실행
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);

    if (tokenJsonData) {
      next();
    }
  } catch (err) {
    const apiResult = {
      code: 400,
      data: null,
      msg: '인증 토큰이 유효하지 않습니다.',
    };

    return res.json(apiResult);
  }
};
