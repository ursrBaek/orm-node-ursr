const path = require("path");
const Sequelize = require("sequelize");

//개발모드 환경설정
const env = process.env.NODE_ENV || "development";

//DB연결 환경설정정보 변경처리//관련정보 수정
// const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
// config.js모듈 파일 기반 DB연결정보 가져오기
const config = require("../config/config.js")[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델 연결
db.Admin = require("./admin")(sequelize, Sequelize);
db.Member = require("./member")(sequelize, Sequelize);

module.exports = db;
