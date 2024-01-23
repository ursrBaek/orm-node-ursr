// 주소록 메뉴 클릭시 전체 회원정보 조회 바인딩
$('#contacts-tab').click(function () {
  // ajax로 전체 회원 정보 조회 데이터 바인딩 처리
  const loginUserToken = localStorage.getItem('userAuthToken');

  $.ajax({
    type: 'GET',
    url: '/api/member/all',
    headers: {
      Authorization: `Bearer ${loginUserToken}`,
    },
    dataType: 'json',
    success: function (result) {
      console.log('모든 사용자 정보 호출 결과: ', result);
      if (result.code == 200) {
        $('.contacts-list').html('');
        result.data.forEach((member) => {
          const userTag = `<li onclick="fnChatEntry(${member.member_id}, '${member.name}', 1);">
              <a href="#">
                <div class="contacts-avatar">
                  <span class="status busy"></span>
                  <img src="${member.profile_img_path}" alt="Avatar" />
                </div>
                <div class="contacts-list-body">
                  <div class="contacts-msg">
                    <h6 class="text-truncate">${member.name}</h6>
                    <p class="text-truncate">${member.email}</p>
                  </div>
                </div>
                <div class="contacts-list-actions">
                  <div class="action-block">
                    <img src="img/dots.svg" alt="Actions" />
                  </div>
                  <div class="action-list">
                    <span class="action-list-item">Chat User</span>
                    <span class="action-list-item">Remove User</span>
                  </div>
                </div>
              </a>
            </li>`;
          $('.contacts-list').append(userTag);
        });
      } else if (result.code == 400) {
        alert(result.msg);
      }
    },
    error: function (err) {
      console.log('api 호출 에러: ', err);
    },
  });
});

// 선택 사용자별 채팅방 입장처리 함수
function fnChatEntry(member_id, nickName, channelType) {
  const loginUserToken = localStorage.getItem('userAuthToken');
  console.log('채팅방 입장을 위한 선택 사용자 정보: ', member_id, nickName);

  // step1: 채팅방 입장처리하기
  const channel = {
    channelType, // 1: 일대일 채널, 2: 그룹채널
    channelID: 0, // 0이면 1대1 채널, 0 이상이면 그룹채널 고유번호
    token: loginUserToken,
    targetMemberId: member_id,
    targetNickName: nickName,
  };

  // 해당 채널 유형별 채팅방 입장하기
  socket.emit('entryChannel', channel);

  // step2: 채팅 화면 UI 표시하기
  $('.empty-chat-screen').addClass('d-none');
  $('.chat-content-wrapper').removeClass('d-none');
  // $('.users-container .users-list li').removeClass('active-chat');
  // $(this).addClass('active-chat');
}

// 서버 소켓으로 메시지 보내기
$('#btnSend').click(function () {
  // 임시로 현재 사용자 닉네임 사용- 추후 토큰에서 정보 추출해야 됨
  // 현재 접속한 채널 고유번호 조회
  const channelId = currentChannel.channel_id;

  // 현재 접속자 대화명 조회
  const nickName = currentUser.name;
  const memberId = currentUser.member_id;
  const profileImg = currentUser.profile_img_path;

  // 입력 메시지 조회
  const message = $('#txtMessage').val();

  // 서버로 그룹 메시지 발송하기
  socket.emit('channelMsg', channelId, memberId, nickName, profileImg, message);
});

// 서버에서 보내준 메시지 수신 처리하기
socket.on('receiveTest', function (nickName, msg, sendDate) {
  console.log(nickName, currentUser.name);
  const msgTag =
    currentUser.name === nickName
      ? `<li class="chat-right">
                  <div class="chat-text-wrapper">
                    <div class="chat-text">
                      <p>${msg}</p>
                      <div class="chat-hour read">${sendDate}<span>&#10003;</span></div>
                    </div>
                  </div>
                  <div class="chat-avatar">
                    <img src="img/user24.png" alt="Quick Chat Admin" />
                    <div class="chat-name">${nickName}</div>
                  </div>
                </li>`
      : `<li class="chat-left">
                <div class="chat-avatar">
                  <img src="img/user21.png" alt="Quick Chat Admin" />
                  <div class="chat-name">${nickName}</div>
                </div>
                <div class="chat-text-wrapper">
                  <div class="chat-text">
                    <p>${msg}</p>
                    <div class="chat-hour read">${sendDate} <span>&#10003;</span></div>
                  </div>
                </div>
              </li>`;
  $('#chatHistory').append(msgTag);

  chatScrollToBottom();
});

// 채팅방 입장완료 메시지 수신기 정의 기능 구현
socket.on('entryok', function (msg, nickName, channelData) {
  console.log('entryok');
  currentChannel = channelData;
  const msgTag = `<li class="divider">${msg}</li>`;

  $('#chatHistory').append(msgTag);

  chatScrollToBottom();
});

// 채팅방 메시지 수신 처리하기
socket.on('receiveChannelMsg', function (nickName, profileImg, msg, sendDate) {
  console.log(nickName, currentUser.name);
  const msgTag =
    currentUser.name === nickName
      ? `<li class="chat-right">
                  <div class="chat-text-wrapper">
                    <div class="chat-text">
                      <p>${msg}</p>
                      <div class="chat-hour read">${sendDate}<span>&#10003;</span></div>
                    </div>
                  </div>
                  <div class="chat-avatar">
                    <img src="${profileImg}" alt="Quick Chat Admin" />
                    <div class="chat-name">${nickName}</div>
                  </div>
                </li>`
      : `<li class="chat-left">
                <div class="chat-avatar">
                  <img src="${profileImg}" alt="Quick Chat Admin" />
                  <div class="chat-name">${nickName}</div>
                </div>
                <div class="chat-text-wrapper">
                  <div class="chat-text">
                    <p>${msg}</p>
                    <div class="chat-hour read">${sendDate} <span>&#10003;</span></div>
                  </div>
                </div>
              </li>`;
  $('#chatHistory').append(msgTag);

  chatScrollToBottom();
});

// 환경설정 아이콘 클릭시 백엔드에서 프로필정보 조회 바인딩
$('#settings-tab').click(function () {
  const loginUserToken = localStorage.getItem('userAuthToken');

  $.ajax({
    type: 'GET',
    url: '/api/member/profile',
    headers: {
      Authorization: `Bearer ${loginUserToken}`,
    },
    dataType: 'json',
    success: function (result) {
      console.log('현재 사용자 정보 호출 결과: ', result);
      if (result.code == 200) {
        $('#member_email').val(result.data.email);
        $('#member_name').val(result.data.name);
        $('#member_telephone').val(result.data.telephone);
        $('#profileImage').attr('src', result.data.profile_img_path);
      } else if (result.code == 400) {
        alert(result.msg);
      }
    },
    error: function (err) {
      console.log('api 호출 에러: ', err);
    },
  });
});
