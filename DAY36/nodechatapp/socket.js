const moment = require('moment');
const jwt = require('jsonwebtoken');

// socket.io 패키지 참조
const SocketIO = require('socket.io');
//socket.io-redis참조
var redis = require('socket.io-redis');

// DB 객체 참조하기
const db = require('./models');

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
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    }),
  );

  // io.on객체의 커넥션 이벤트에 대한 이벤트 핸들러 정의
  // 클라이언트와 연결이 완료되면(connection 이벤트 발생) 메시지 수발신 기능을 제공
  // connection 되면 callback이 실행되는데 클라이언트/서버 연결정보를 가진 socket 객체가 인수로 전달되어 실행됨.
  // io는 서버소켓 자체, socket은 각각의 클라이언트와 연결된 연결정보 객체
  io.on('connection', async (socket) => {
    //소켓Req객체
    const req = socket.request;

    //접속 클라이언트 IP주소
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //사용자IP
    // 현재 연결되는 사용자들 기반을 사용할 전역변수 정의 사용
    const socketID = socket.id; // 현재 연결 사용자의 고유한 커넥션 아이디

    // 시스템 소켓 이벤트 재 정의하기
    // disconnect: 웹브라우저와 서버소켓이 끊어질떄마다 자동으로 발생하는 이벤트
    // - 사용자가 채팅중에 브라우저 탭을 닫거나 일시적 네트워크 장애가 발생시 등 웹소켓이 끊기는 경우
    // - 서버소켓에서 자동 소켓 끊김 감지 기능제공
    socket.on('disconnect', async () => {
      // 개발자 정의 현재 접속자 연결 끊김 처리 함수
      await UserConnectionOut();

      // 소켓 끊김시 서버측 자원정리 기능제공
      clearInterval(socket.interval);
    });

    // 소켓 통신 에러 감지 이벤트핸들러
    socket.on('error', async (error) => {
      console.log('서버 소켓 에러발생 이벤트 감지...');
    });

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
    socket.on('test', function (nickName, msg) {
      const sendDate = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss');
      io.emit('receiveTest', nickName, msg, sendDate);
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
    });

    // 채팅방 기준 사용자 메시지 수.발신 처리
    socket.on('groupmsg', async (msgData) => {
      const sendMsg = `${msgData.nickname}: ${msgData.message}`;
      // 해당 채널에 나를 포함한 모든 사용자에게 메시지 보내기
      io.to(msgData.channelId).emit('receiveGroupMsg', sendMsg);
    });

    // 채팅방 입장하기
    socket.on('entryChannel', async (channel) => {
      try {
        const currentUser = jwt.verify(channel.token, process.env.JWT_SECRET);

        // step1: 채널 유형별 채널정보 생성 또는 조회하기
        // 일대일 채널(1)은 생성, 그룹채널(2)은 조회
        let channelData;
        if (channel.channelType == 1) {
          const channel_name =
            channel.targetMemberId < currentUser.member_id
              ? `${channel.targetMemberId}-${currentUser.member_id}`
              : `${currentUser.member_id}-${channel.targetMemberId}`;
          // 일대일 채널 존재여부 체크 후 없으면 생성
          channelData = await db.Channel.findOne({ where: { channel_name, category_code: 1 } });
          console.log('일대일 채널 존재여부 채크 후 없으면 생성!');
          if (!channelData) {
            console.log('채널 존재 안해서 생성!!');
            const channelInfo = {
              community_id: 1,
              category_code: channel.channelType,
              channel_name,
              channel_img_path: '',
              user_limit: 2,
              channel_desc: '',
              channel_state_code: 1,
              reg_date: Date.now(),
              reg_member_id: currentUser.member_id,
            };

            // 1대1 채널 신규 생성
            const newChannel = await db.Channel.create(channelInfo);

            channelData = newChannel;

            // 1대1 채널 구성원 정보 등록
            const currentMember = {
              channel_id: newChannel.channel_id,
              member_id: currentUser.member_id,
              nick_name: currentUser.name,
              member_type_code: 1,
              active_state_code: 0,
              connection_id: '',
              ip_address: '',
              edit_date: Date.now(),
              edit_member_id: currentUser.member_id,
            };
            const currentMemberInfo = await db.ChannelMember.create(currentMember);

            const targetMember = {
              channel_id: newChannel.channel_id,
              member_id: channel.targetMemberId,
              nick_name: channel.targetNickName,
              member_type_code: 0,
              active_state_code: 0,
              connection_id: '',
              ip_address: '',
              edit_date: Date.now(),
              edit_member_id: currentUser.member_id,
            };
            const targetMemberInfo = await db.ChannelMember.create(targetMember);

            console.log('채널멤버~커런트!!!!!!:', currentMemberInfo);
            console.log('채널멤버~타겟!!!!!!:', targetMemberInfo);
          }
        } else {
          // 그룹채널 정보 조회
          // 전달된 채널 고유번호로 조회해서 channelData에 할당하면 됨
          // channelData = await db.Channel.findOne({where: {channel_id: }})
        }

        // step2: 현재 채팅방 접속자 정보 업데이트
        // 현재 접속자의 접속상태와 접속일시 정보 업데이트 처리
        const updateMember = {
          active_state_code: 1,
          last_contact_date: Date.now(),
          connection_id: socketID,
          ip_address: userIP,
        };
        await db.ChannelMember.update(updateMember, {
          where: { channel_id: channelData.channel_id, member_id: currentUser.member_id },
        });

        // step3: 채널 조인(채팅방 입장 처리하기)
        socket.join(channelData.channel_id);

        // step4: 채널 조인결과 메시지 발송
        // 현재 접속자에게 메시지 발송하기
        socket.emit('entryok', `${currentUser.name} 대화명으로 입장했습니다.`, currentUser.name, channelData);

        // 채팅방에 나를 제외한 모든 채팅방 사용자에게 입장 사실 알림
        socket
          .to(channelData.channel_id)
          .emit('entryok', `${currentUser.name}님이 채팅방에 입장했습니다.`, currentUser.name, channelData);

        // 채팅방 입장 로그 기록하기
        await chattingMsgLogging(
          channelData.channel_id,
          currentUser.member_id,
          currentUser.name,
          1,
          `${currentUser.name}님이 채팅방에 입장했습니다.`,
        );
      } catch (err) {
        console.log('채널 입장 에러 발생!!!! : ', err);
        // 현재 사용자에게 서버 에러로 채널 입장 실패 메시지 보내기
        socket.emit('entryok', '채널 접속 오류가 발생했습니다.');
      }
    });

    // 채팅방별 메시지 수발신 처리
    socket.on('channelMsg', async (channelId, member_id, nickName, profileImg, message) => {
      const sendDate = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss');
      // 해당 채널의 모든 사용자들에게 메시지 발송하기
      io.to(channelId).emit('receiveChannelMsg', nickName, profileImg, message, sendDate);

      // 채팅 이력 로그 기록하기
      await chattingMsgLogging(channelId, member_id, nickName, 2, message);
    });

    // 채팅이력 정보 기록처리 함수
    async function chattingMsgLogging(channel_id, member_id, nick_name, msg_type_code, message) {
      const msg = {
        channel_id,
        member_id,
        nick_name,
        msg_type_code,
        connection_id: socketID,
        message,
        ip_address: userIP,
        msg_state_code: 1,
        msg_date: Date.now(),
      };

      await db.ChannelMessage.create(msg);
    }

    // 사용자 나가기 정보 처리
    async function UserConnectionOut() {
      // 현재 접속이 끊어지는 사용자의 connection_id 기반으로 현재 사용자 정보 조회
      const member = await db.ChannelMember.findOne({ where: { connection_id: socketID } });

      if (member) {
        // 사용자 연결 끊김 정보 수정 반영하기
        const updateMember = {
          active_state_code: 0,
          last_out_date: Date.now(),
          connection_id: socketID,
          ip_address: userIP,
        };
        await db.ChannelMember.update(updateMember, {
          where: { connection_id: socketID },
        });

        // 채팅방 퇴장 로그 기록하기
        await chattingMsgLogging(
          member.channel_id,
          member.member_id,
          member.nick_name,
          0,
          `${member.nick_name}님이 채팅방을 퇴장했습니다.`,
        );
      }
    }
  });
};
