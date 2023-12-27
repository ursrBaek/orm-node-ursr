// Sequelize 모델을 정의하는 함수를 내보냄
module.exports = function (sequelize, DataTypes) {
  // 파라미터 sequelize는 db 연결정보를 담은 객체.
  // 파라미터 DataTypes는 Sequelize 패키지

  // sequelize.define(): 해당 모델 구조를 통해 물리적 테이블을 생성시키는 기능 제공
  // sequelize.define('테이블명-기본복수형으로 만들어짐'-members', 관리항목(컬럼)구조정의, 테이블 생성 옵션);

  // 'member' 모델을 정의
  return sequelize.define(
    'member', // 모델의 이름, 데이터베이스 테이블의 이름으로 사용됨. members
    {
      // 'member_id' 컬럼 정의
      member_id: {
        type: DataTypes.INTEGER, // 데이터 타입은 정수형
        autoIncrement: true, // 자동 증가 속성
        primaryKey: true, // 기본 키
        allowNull: false, // NULL 값 허용 안 함
        comment: '회원고유번호', // 주석
      },
      // 'email' 컬럼 정의
      email: {
        type: DataTypes.STRING(100), // 데이터 타입은 문자열, 최대 길이 100 varchar(100)
        allowNull: false,
        comment: '사용자메일주소',
      },
      // 'password' 컬럼 정의
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '사용자암호',
      },
    },
    {
      // 옵션 객체
      timestamps: true, // 등록일시(createdAt) 및 수정일시(updatedAt) 컬럼 자동생성하여 추가
      paranoid: true, // 데이터 삭제 컬럼(deletedAt) 자동 생성 및 물리적 데이터 삭제 안함(논리적 삭제만! 데이터가 삭제된것처럼 컬럼을통해 삭제 마킹만 하는거임) 기능 제공
    },
  );
};
