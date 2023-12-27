// 사용자 정보처리를 위한 RESTFUL 데이터전용 요청과 응답처리 전용 라우터 파일

var express = require('express');
var router = express.Router();

// 모델 영역의 db객체 참조
var db = require('../models');

// 회원 로그인 처리 전용 RESTful API
router.post('/login', async function (req, res, next) {
  var apiResult = {
    code: 200,
    data: null,
    result: '',
  };

  try {
    // step1: 사용자 로그인 정보 추출하기
    const { email, password } = req.body;

    // step2: DB members테이블에서 동일한 메일주소의 단일 사용자 정보 조회
    // db.Member.findOne(해당 컬럼과 동일한 조건설정) ORM메소드는
    // SELECT * FROM members WHERE email='사용자입력메일주소값'; 의 SQL구문을 백엔드 환경에서 동적으로 만들어서
    // MYSQL 서버로 전달해 실행하고 조회 결과물을 반환받는다.
    const member = await db.Member.findOne({ where: { email } });

    // step3: 로그인 처리 로직 구현
    var resultMsg = '';

    if (member == null) {
      resultMsg = '동일한 메일주소가 존재하지 않습니다.';
      apiResult.code = 400;
      apiResult.data = null;
      apiResult.result = resultMsg;
    } else {
      // DB서버에 저장되어 조회된 암호값과 사용자가 입력한 암호값이 일치하면
      if (member.password == password) {
        resultMsg = '로그인 성공';
        apiResult.code = 200;
        apiResult.data = member;
        apiResult.result = resultMsg;
      } else {
        resultMsg = '암호가 일치하지 않습니다.';
        apiResult.code = 400;
        apiResult.data = null;
        apiResult.result = resultMsg;
      }
    }
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = '서버에러발생 관리자에게 문의하세요.';
  }

  res.json(apiResult);
});

module.exports = router;
