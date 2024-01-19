//socket.io 팩키지 참조
const SocketIO = require('socket.io');

//socket.io-redis참조
var redis = require('socket.io-redis');

//socket.js모듈 기능정의
module.exports = (server) => {
  const io = SocketIO(server, { path: '/socket.io' });

  //Redis Backplain 연결설정
  io.adapter(
    redis({
      host: '127.0.0.1',
      port: '6379',
      // password: process.env.REDIS_PW
    }),
  );

  io.on('connection', (socket) => {
    // 클라이언트에서 메시지를 보내면 수신하는 서버측 메시지 수신기(broadcast)
    socket.on('broadcast', function (msg) {
      // 현재 서버 소켓에 연결된 모든 사용자에게 메시지 발송하기
      io.emit('receiveAll', msg);
    });
  });
};
