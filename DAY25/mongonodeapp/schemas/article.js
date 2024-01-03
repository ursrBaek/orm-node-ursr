const mongoose = require('mongoose');

// 숫자 자동채번 기능제공을 위한 mongoose-sequence 패키지 설치 및 참조
// npm i mongoose-sequence@5.3.1
// mongoose-sequence 기능을 이용하면 MongoDB에 counter콜렉션이 추가되어 자동채번되며 데이터를 관리함
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

// Schema 클래스 생성. 생성자함수에 새로 만들 콜렉션의 스키마(데이터구조)를 정의
const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  article_type_code: {
    type: Number,
    required: true,
  },
  contents: {
    type: String,
    required: false,
  },
  view_count: {
    type: Number,
    required: true,
  },
  is_display_code: {
    type: Number,
    required: true,
  },
  ip_address: {
    type: String,
    required: false,
  },
  edit_date: {
    type: Date,
    default: Date.now,
  },
  edit_member_id: {
    type: Number,
    required: false,
  },
});

// 자동채번 컬럼생성 및 콜렉션에 추가
articleSchema.plugin(AutoIncrement, { inc_field: 'article_id' }); //article_id는 1,2,3,4..

// mongoose.model('콜렉션이름', 콜렉션 구조가 정의된 인스턴스)메서드 호출하여 물리적인 콜렉션(테이블)을 생성
module.exports = mongoose.model('Article', articleSchema);
