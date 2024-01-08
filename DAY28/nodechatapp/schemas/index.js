const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect(
    `mongodb://${process.env.MONGO_DB_ID}:${process.env.MONGO_DB_PASSWORD}@127.0.0.1:27017/admin`,
    {
      dbName: 'modu_chat',
    },
    (error) => {
      if (error) {
        console.log('몽고디비 연결 에러!!!', error);
      } else {
        console.log('몽고디비 연결 성공~');
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

//회원정보 콜렉션 모델을 참조합니다.
require('./member.js');

// 채널 ODM 콜렉션 추가
require('./channel.js');

// 채널메시지 ODM 콜렉션 추가
require('./channelMessage.js');

// 채널멤버 ODM 콜렉션 추가
require('./channelMember.js');

module.exports = connect;
