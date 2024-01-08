const mongoose = require('mongoose');

const { Schema } = mongoose;

// Schema 클래스 생성. 생성자함수에 새로 만들 콜렉션의 스키마(데이터구조)를 정의
const channelMemberSchema = new Schema({
  channel_id: {
    type: Number,
    required: true,
  },
  member_id: {
    type: Number,
    required: true,
  },
  nick_name: {
    type: String,
    required: true,
  },
  member_type_code: {
    type: Number,
    required: true,
  },
  active_state_code: {
    type: Number,
    required: true,
  },
  last_contact_date: {
    type: Date,
    required: true,
  },
  member_out_date: {
    type: Date,
    required: true,
  },
  connection_id: {
    type: String,
    required: true,
  },
  ip_address: {
    type: String,
    required: true,
  },
  edit_member_id: {
    type: Number,
    required: false,
  },
  edit_date: {
    type: Date,
    required: false,
  },
});

// mongoose.model('콜렉션이름', 콜렉션 구조가 정의된 인스턴스)메서드 호출하여 물리적인 콜렉션(테이블)을 생성
module.exports = mongoose.model('Channel_member', channelMemberSchema);
