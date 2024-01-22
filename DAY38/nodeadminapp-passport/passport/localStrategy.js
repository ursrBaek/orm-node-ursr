const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models/index');

// 로컬 인즌 전략으로 login 기능 구현
module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'admin_id', //로그인 페이지의 사용자아이디 UI INPUT 요소 name값
        passwordField: 'admin_password', //로그인 페이지의 사용자 암호 INPUT 요소 name값
      },
      async (admin_id, admin_password, done) => {
        try {
          const admin_member = await db.Admin.findOne({ where: { admin_id: admin_id } });
          if (admin_member) {
            const result = await bcrypt.compare(admin_password, admin_member.admin_password);
            if (result) {
              var sessionUser = {
                admin_member_id: admin_member.admin_member_id,
                company_code: admin_member.company_code,
                admin_id: admin_member.admin_id,
                admin_name: admin_member.admin_name,
              };

              done(null, sessionUser); // 서버에 세션 데이터 저장
            } else {
              //사용자 암호가 일치하지 않은 경우
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            //사용자 아이디가 존재하지 않은경우
            done(null, false, { message: '아이디가 존재하지 않습니다.' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};
