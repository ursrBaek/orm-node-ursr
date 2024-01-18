// socket.io 패키지 참조
const SocketIO = require('socket.io');

//socket.io-redis참조
var redis = require('socket.io-redis');

//socket.js모듈 기능정의
module.exports = (server) => {
  // SocketIO('서버소켓이 실행될 백엔드서버 객체', 클라이언트에 제공될 소켓 라이브러리 경로)
  // 클라이언트측에 제공될 소켓 라이브러리는 설정한 경로의 위치에 생성되어 제공된다고 함. _ http://localhost:3000/socket.io/socket.io.js
  // const io = SocketIO(server, { path: '/socket.io' });

  //CORS 지원 IO객체생성
  const io = SocketIO(server, {
    path: '/socket.io',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  //Redis Backplain 연결설정
  io.adapter(
    redis({
      host: '127.0.0.1',
      port: '6379',
      // password: process.env.REDIS_PW
    }),
  );

  // io.on객체의 커넥션 이벤트에 대한 이벤트 핸들러 정의
  // 클라이언트와 연결이 완료되면(connection 이벤트 발생) 메시지 수발신 기능을 제공
  // connection 되면 callback이 실행되는데 클라이언트/서버 연결정보를 가진 socket 객체가 인수로 전달되어 실행됨.
  // io는 서버소켓 자체, socket은 각각의 클라이언트와 연결된 연결정보 객체
  io.on('connection', async (socket) => {
    // 서버소켓과 연결된 각각의 클라이언트간 수발신 기능 구현
    // socket.on("서버측 메시지 수신기 이벤트명", 이벤트핸들러)
    socket.on('broadcast', function (msg) {
      // io.emit("클라이언트 이벤트 수신기 명 ", data): 현재 서버소켓인 io에 연결된 모든 사용자에게
      // 지정한 클라이언트 이벤트 수신기명에 해당 메시지 데이터를 보낸다.
      // io.emit() 서버 소켓에 연결된 모든 클라이언트 사용자에게 메시지 발송
      io.emit('receiveAll', msg);
      //socket.broadcast.emit("receive",msg);
    });

    // 테스트용 서버측 이벤트 수신기 정의와 클라이언트 메시지 본내기 샘플
    // 서버측/클라이언트측 이벤트 수신기명과 전달 데이터수/포맷은 개발자가 정의(메시징설계)
    socket.on('test', function (msg) {
      io.emit('receiveTest', msg);
    });

    // 채팅방 개설 및 채팅방 입장하기 기능 처리하고 클라이언트에 입장사실 알리기
    socket.on('entry', function (channelId, nickname) {
      //채팅방 사용자 입장처리하기 socket.join(채팅방 고유아이디 문자열)
      // socket.join 동일 채널아이디가 없으면 해당 채팅방을 만들고 있으면 접속한다
      socket.join(channelId);

      // 채널 입장사실 사용자들에게 알려주기 3가지 방법
      // 1. 현재 접속한 사용자에게만 메시지 보내기
      socket.emit('entryok', `${nickname} 대화명으로 입장했습니다.`);
      // 2. 채팅방에 현재 접속한 나를 제외한 나머지 사용자들에게만 메시지를 보내기
      socket.to(channelId).emit('entryok', `${nickname}님이 채팅방에 입장했습니다.`);

      // 3. 해당 채팅방에 나를 포함한 모든 사용자에게 메시지 보내기
      // io.to(channelId).emit('entryok', `${nickname}님이 채팅방에 입장했습니다.`);

      // 채팅방 기준 상ㅇ자 메시지 수.발신 처리
      socket.on('groupmsg', async (msgData) => {
        const sendMsg = `${msgData.nickname}: ${msgData.message}`;
        // 해당 채널에 나를 포함한 모든 사용자에게 메시지 보내기
        io.to(msgData.channelId).emit('receiveGroupMsg', sendMsg);
      });
    });
  });
};
