const mongoose = require('mongoose');

// DB연결 설정하는 connect 함수
const connect = () => {
  // 개발환경인 경우 디버깅 가능하게 설정
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  //몽고DB연결정보를 설정합니다.
  mongoose.connect(
    'mongodb://nara:dodo22477!@localhost:27017/admin',
    {
      dbName: 'modu_chat',
    },
    (error) => {
      if (error) {
        console.log('몽고디비 연결 에러', error);
      } else {
        console.log('몽고디비 연결 성공');
      }
    },
  );
};

// 몽고DB 연결중 에러 이벤트 발생했을 때의 로직
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

// 몽고DB 연결중 연결종료 이벤트 발생했을 때의 로직
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

//회원정보 콜렉션 모델을 참조합니다.
// require('./member.js');

//게시글 ODM모델 추가
require('./article.js');

module.exports = connect;
