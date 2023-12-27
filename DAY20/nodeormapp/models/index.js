// 데이터베이스와 매핑되는 기본 코드
// mvc 패턴 중 model의 실체 영역

const path = require('path');
// Sequelize ORM (Object-Relational Mapping) 프레임워크를 가져옴
const Sequelize = require('sequelize');

//개발모드 환경설정 ('development'이 기본) - NODE_ENV 환경 변수에 기반
const env = process.env.NODE_ENV || 'development';

//DB연결 환경설정정보 변경처리//관련정보 수정
// Sequelize 구성 파일의 파일 경로를 현재 디렉토리와 환경에 기반하여 생성
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

// Sequelize 모델을 저장할 빈 객체를 생성
const db = {};

// DB연결정보로 시퀄라이즈 ORM 객체 생성
// Sequelize 구성 매개변수를 사용하여 새 Sequelize 인스턴스를 생성 (DB서버의 연결정보가 갖춰진 시퀄라이즈 인스턴스가 생성되는거임)
const sequelize = new Sequelize(config.database, config.username, config.password, config);

//DB 처리 객체에 시퀄라이즈 정보 맵핑처리
//이후 DB객체를 통해 데이터 관리가능해짐
db.sequelize = sequelize; //DB연결정보를 포함한 DB제어 객체속성(CRUD)
db.Sequelize = Sequelize; //Sequelize팩키지에서 제공하는 각종 데이터 타입 및 관련 객체정보(Sequelize 모듈)를 제공함

//회원모델 모듈파일 참조하고 db속성정의하기
db.Member = require('./member.js')(sequelize, Sequelize);

//db객체(Sequelize 인스턴스 및 모델을 포함) 외부로 노출하기
module.exports = db;
