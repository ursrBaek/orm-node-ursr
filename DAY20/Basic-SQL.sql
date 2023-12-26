USE modu_chat;

# member 테이블의 전체컬럼(*) 데이터 조회
SELECT * From member;

# Create data - 데이터 등록 /INSERT 구문
# INSERT INTO 테이블명(컬럼1, 컬럼2,....)VALUES(컬럼1의 등록값, 컬럼2의 값...);
INSERT INTO member(email, member_password, name, profile_img_path, telephone, entry_type_code, use_state_code, birth_date, reg_date, reg_member_id)
VALUES('test1@test.co.kr', '1234', '백나라', '', '010-1234-1234', 1, 1, '890619', now(), 1);

INSERT INTO member(email, member_password, name, profile_img_path, telephone, entry_type_code, use_state_code, birth_date, reg_date, reg_member_id)
VALUES('test2@test.co.kr', '1234', '백나라2', '', '010-1234-1236', 1, 1, '890619', now(), 1);

INSERT INTO member(email, member_password, name, profile_img_path, telephone, entry_type_code, use_state_code, birth_date, reg_date, reg_member_id)
VALUES('test3@test.co.kr', '1234', '백나라4', '', '010-1234-1237', 1, 1, '890619', now(), 1);

# READ Data 데이터조회 SELECT 구문
SELECT * FROM member;
SELECT * FROM member WHERE email='test1@test.co.kr';
SELECT * FROM member WHERE entry_type_code = 1 AND name = '백나라';
SELECT * FROM member WHERE entry_type_code = 1 OR use_state_code = 0;
SELECT * FROM member WHERE member_id >= 3;
SELECT member_id, email, name, telephone FROM member WHERE member_id >= 3;
SELECT * FROM member WHERE name IN('백나라2', '백나라3', '백나라4');
SELECT * FROM member WHERE name LIKE '백%'; # 패턴매칭: '%가' 가로 끝나는 모든 항목, '%가%' 가가 포함된 모든 데이터, '가%' 가로 시작하는 모든 데이터
SELECT * FROM member ORDER BY member_id DESC;
SELECT * FROM member ORDER BY member_id ASC;


# Update data - 데이터 수정 UPDATE 구문
UPDATE member SET name = '백나라0', profile_img_path='http://naver.com/images/test.png' WHERE member_id = 1;
UPDATE member SET use_state_code = 0 WHERE member_id > 2;

# Delete data = 데이터 삭제 DELETE 구문

DELETE FROM member WHERE email='test4@test.co.kr';
