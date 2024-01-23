// 채널 채팅이력 정보

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'channel_msg',
    {
      channel_msg_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: '채널 메시지 고유번호',
      },
      channel_id: { type: DataTypes.INTEGER, allowNull: false, comment: '채널고유번호' },
      member_id: { type: DataTypes.INTEGER, allowNull: false, comment: '메시지 발생 회원 고유번호' },
      nick_name: { type: DataTypes.STRING(100), allowNull: false, comment: '대화명-닉네임' },
      msg_type_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '메시지 발생 유형코드 1:입장 0:퇴장 2:일반메시지 3:파일 공유 메시지 4:시스템공지메시지',
      },
      connection_id: { type: DataTypes.STRING(100), allowNull: false, comment: '웹소켓 고유 연결 아이디' },
      message: { type: DataTypes.TEXT, allowNull: false, comment: '채팅 메시지 내용' },
      ip_address: { type: DataTypes.STRING(50), allowNull: false, comment: 'IP주소' },
      msg_state_code: { type: DataTypes.INTEGER, allowNull: false, comment: '메시지 상태 코드 0:삭제, 1:사용중' },
      msg_date: { type: DataTypes.DATE, allowNull: false, comment: '메시지 작성 일시' },
      edit_date: { type: DataTypes.DATE, allowNull: true, comment: '메시지 수정일시' },
      del_date: { type: DataTypes.DATE, allowNull: true, comment: '메시지 삭제일시' },
    },
    {
      sequelize,
      tableName: 'channel_msg',
      timestamps: false,
      comment: '채널 메시지 정보',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'channel_msg_id' }],
        },
      ],
    },
  );
};
