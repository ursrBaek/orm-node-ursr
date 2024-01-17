const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models/index');

module.exports = (passport) => {
  // passport.use('로컬인증전략정의하기(클래스)')
  // new LocalStrategy('로그인화면의 아이디/암호 UI요소의 네임값설정', 로그인 처리 함수)
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'admin_id',
        passwordField: 'admin_password',
      },
      async (admin_id, admin_password, done) => {
        // 사용자가 입력한 아이디/암호를 기반으로 로그인 기능을 구현.
        try {
          // step1: 동일한 사용자 아이디 정보조회
          const admin_member = await db.Admin.findOne({ where: { admin_id } });

          if (admin_member) {
            // step2: 사용자 암호를 체크한다.
            const result = await bcrypt.compare(admin_password, admin_member.admin_password);

            if (result) {
              // 관리자 아이디/암호가 일치하는 경우
              // step3: 로그인 관리자의 세션 정보 구조정의 및 데이터 바인딩
              const sessionLoginData = {
                admin_member_id: admin_member.admin_member_id,
                company_code: admin_member.company_code,
                admin_id: admin_member.admin_id,
                admin_name: admin_member.admin_name,
              };

              // done(null, 세션으로 저장할 세션데이터)
              done(null, sessionLoginData);
            } else {
              // 관리자 아이디/암호가 일치하지 않는 경우
              // done(null, 세션으로 저장할 데이터가 없으면 false, 추가옵션데이터);
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            // 동일한 아이디가 없는 경우
            done(null, false, { message: '아이디가 일치하지 않습니다.' });
          }
        } catch (err) {
          done(err);
        }
      },
    ),
  );
};
