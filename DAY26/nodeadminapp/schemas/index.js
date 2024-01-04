const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    //현재 소스 실행환경이 개발환경인 경우 디버깅 가능하게 설정한다.
    mongoose.set('debug', true);
  }
  //몽고DB연결정보를 설정합니다.
  mongoose.connect(
    `mongodb://${process.env.MONGO_DB_ID}:${process.env.MONGO_DB_PASSWORD}@127.0.0.1:27017/admin`,
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
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

require('./models/admin.js');
require('./models/member.js');

module.exports = connect;
