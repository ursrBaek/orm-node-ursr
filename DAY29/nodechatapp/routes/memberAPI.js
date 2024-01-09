// 회원 정보관리 RESTful API 전용 라우팅 기능 제공

var express = require('express');
var router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     member:
 *       type: object
 *       required:
 *         - member_id
 *         - member_password
 *         - email
 *         - name
 *         - telephone
 *         - birth_date
 *         - use_state_code
 *         - reg_date
 *       properties:
 *         member_id:
 *           type: string
 *           description: 사용자 고유 번호
 *         member_password:
 *           type: string
 *           description: 사용자 비밀번호
 *         email:
 *           type: string
 *           description: 사용자 메일주소
 *         name:
 *           type: string
 *           description: 사용자 이름
 *         telephone:
 *           type: string
 *           description: 사용자 전화번호
 *         birth_date:
 *           type: string
 *           format: date
 *           description: 생년월일
 *         use_state_code:
 *           type: number
 *           description: 사용여부
 *         reg_date:
 *           type: string
 *           format: date
 *           description: 등록일자
 *
 */

/**
 * @swagger
 * tags:
 *  name: Members
 *  description: 사용자 목록 제어 API
 */

const memberList = [
  {
    member_id: 1,
    member_password: '1234',
    email: 'momo@naver.com',
    name: '모모',
    telephone: '010131311',
    birth_date: '1991.11.11',
    use_state_code: 1,
    reg_date: '2021-11-22',
  },
  {
    member_id: 2,
    member_password: '1234',
    email: 'jojo@naver.com',
    name: '조조',
    telephone: '010222222',
    birth_date: '1991.11.12',
    use_state_code: 0,
    reg_date: '2021-11-23',
  },
  {
    member_id: 3,
    member_password: '1234',
    email: 'toto@naver.com',
    name: '토토',
    telephone: '010333333',
    birth_date: '1991.11.14',
    use_state_code: 1,
    reg_date: '2021-11-24',
  },
];

/**
 * @swagger
 * /api/member:
 *   get:
 *     summary: 전체 회원 목록 조회
 *     tags:
 *       - Members
 *     responses:
 *       200:
 *         description: 전체 회원 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   enum: [200]
 *                   description: 응답 코드
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/member'
 *                   description: 회원 목록
 *                 result:
 *                   type: string
 *                   description: 응답 결과
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   enum: [500]
 *                   description: 오류 코드
 *                 data:
 *                   type: null
 *                   description: 오류 발생 시 데이터는 null
 *                 result:
 *                   type: string
 *                   description: 오류 메시지
 */

// 전체 회원목록 데이터 조회 GET 요청 - 전체 회원 목록 데이터 응답
router.get('/', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    apiResult.code = 200;
    apiResult.data = memberList;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }
  res.json(apiResult);
});

/**
 * @swagger
 * /api/member:
 *   post:
 *     summary: 신규 회원 등록
 *     tags:
 *       - Members
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 사용자 이름
 *               telephone:
 *                 type: string
 *                 description: 사용자 전화번호
 *               email:
 *                 type: string
 *                 description: 사용자 이메일 주소
 *             required:
 *               - name
 *               - telephone
 *               - email
 *     responses:
 *       200:
 *         description: 회원 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   enum: [200]
 *                   description: 응답 코드
 *                 data:
 *                   $ref: '#/components/schemas/member'
 *                   description: 추가된 회원 정보
 *                 result:
 *                   type: string
 *                   description: 응답 결과
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   enum: [500]
 *                   description: 오류 코드
 *                 data:
 *                   type: null
 *                   description: 오류 발생 시 데이터는 null
 *                 result:
 *                   type: string
 *                   description: 오류 메시지
 */

// 신규 회원 정보 등록 처리 POST 요청 - 신규 회원 등록 처리
router.post('/create', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };
  try {
    const { name, telephone, email } = req.body;

    const savedMember = {
      member_id: 1,
      member_password: '1234',
      email,
      name,
      telephone,
      birth_date: '1991.11.11',
      use_state_code: 1,
      reg_date: '2021-11-22',
    };

    apiResult.code = 200;
    apiResult.data = savedMember;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

/**
 * @swagger
 * /api/member/{mid}:
 *   put:
 *     summary: 기존 회원 정보 수정
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: mid
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 회원의 고유 번호
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 수정할 사용자 이름
 *               telephone:
 *                 type: string
 *                 description: 수정할 사용자 전화번호
 *               email:
 *                 type: string
 *                 description: 수정할 사용자 이메일 주소
 *             required:
 *               - name
 *               - telephone
 *               - email
 *     responses:
 *       200:
 *         description: 회원 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   enum: [200]
 *                   description: 응답 코드
 *                 data:
 *                   type: number
 *                   description: 수정된 회원 수
 *                 result:
 *                   type: string
 *                   description: 응답 결과
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   enum: [500]
 *                   description: 오류 코드
 *                 data:
 *                   type: null
 *                   description: 오류 발생 시 데이터는 null
 *                 result:
 *                   type: string
 *                   description: 오류 메시지
 */

// 기존 회원 정보 데이터 수정처리 POST 요청 - 기존 회원 정보 데이터 수정처리
router.post('/modify/:mid', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const { name, telephone, email } = req.body;

    const affectedCnt = 1;

    apiResult.code = 200;
    apiResult.data = affectedCnt;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

/**
 * @swagger
 * /api/member?mid={member_id}:
 *   delete:
 *     summary: 기존 회원 정보 삭제
 *     tags:
 *       - Members
 *     parameters:
 *       - in: query
 *         name: mid
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 회원의 고유 번호
 *     responses:
 *       200:
 *         description: 회원 정보 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   enum: [200]
 *                   description: 응답 코드
 *                 data:
 *                   type: number
 *                   enum: [1]
 *                   description: 삭제된 회원 수
 *                 result:
 *                   type: string
 *                   description: 응답 결과
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   enum: [500]
 *                   description: 오류 코드
 *                 data:
 *                   type: null
 *                   description: 오류 발생 시 데이터는 null
 *                 result:
 *                   type: string
 *                   description: 오류 메시지
 */

// 기존회원 정보 데이터 삭제처리 POST 요청 - 기존 회원 정보 삭제 처리
router.post('/delete', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const { id } = req.query.mid;

    const deletedCnt = 1;

    apiResult.code = 200;
    apiResult.data = deletedCnt;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 단일 회원정보 데이터 조회 GET 요청 - 단일 회원정보 데이터 응답
router.get('/:mid', function (req, res, next) {
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    const memberId = req.params.cid;

    const member = memberList[memberId - 1] || {
      member_id: 100,
      member_password: '1234',
      email: 'momo@naver.com',
      name: '단일조회멤버',
      telephone: '010131311',
      birth_date: '1991.11.11',
      use_state_code: 1,
      reg_date: '2021-11-22',
    };

    apiResult.code = 200;
    apiResult.data = member;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});
module.exports = router;
