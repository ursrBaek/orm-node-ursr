// 게시글 데이터 관리 전용 RESTful API 라우터 파일
// 기본 라우터 호출주소: http://localhost:3000/api/article/~

const express = require('express');
const router = express.Router();

// 전체 게시글 목록 데이터 조회 반환 API 라우팅 메소드
// http://localhost:3000/api/article/all
router.get('/all', async (req, res) => {
  // API 라우팅 메소드 반환형식 정의
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  // 예외처리 구문...
  try {
    // try블록 안에 에러가 발생할 수 있는 각종 개발자 코드 작성
    // step1: DB에서 전체 게시글 목록 데이터를 조회한다.
    const articles = [
      {
        article_id: 1,
        board_type_code: 1,
        title: '공지게시글 1번글입니다.',
        contents: '공지게시글 1번 내용입니다.',
        view_count: 12,
        ip_address: '111.111.124.44',
        is_display_code: 1,
        reg_date: '2023-12-12',
        reg_member_id: 'nara',
      },
      {
        article_id: 2,
        board_type_code: 2,
        title: '기술 블로깅 게시글 1번글입니다.',
        contents: '공지게시글 2번 내용입니다.',
        view_count: 20,
        ip_address: '222.111.124.44',
        is_display_code: 0,
        reg_date: '2023-12-12',
        reg_member_id: 'nara',
      },
      {
        article_id: 3,
        board_type_code: 2,
        title: '기술게시글 2번글입니다.',
        contents: '기술게시글 2번 내용입니다.',
        view_count: 33,
        ip_address: '333.111.124.44',
        is_display_code: 1,
        reg_date: '2023-12-12',
        reg_member_id: 'nara',
      },
    ];

    // 프론트엔드로 반환할 실제데이터 바인딩
    apiResult.code = 200;
    apiResult.data = articles;
    apiResult.result = 'ok';
  } catch (err) {
    //console.log(err.message)
    // 서버측 에러코드는 프론트엔드나 사용자에게 직접 정보를 제공하지 않고 대표 메시지를 안내한다.
    // 서버측 에러코드는 추후 별도 로깅시스템 구현을 통해 서버에 특정폴더내에 로그파일로 기록하거나
    // 백엔드 에러발생 알림 시스템(sms, email..)을 통해 실시간 에러정보를 노티해준다.
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 신규 게시글 등록처리 API 라우팅 메소드
// http://localhost:3000/api/article/create
router.post('/create', async (req, res) => {
  // API 라우팅 메소드 반환형식 정의
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    // step1: 프론트엔드에서 전달해준 신규 게시글 JSON 데이터 추출하기
    const { boardTypeCode, title, contents, articleTypeCode, isDisplayCode, register } = req.body;

    // step2: 추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해서
    // DB article 테이블에 영구적으로 저장처리한다.
    // 저장처리 후 article 테이블에 저장된 데이터 반환됩니다.

    // 등록할 게시글 데이터
    const article = {
      boardTypeCode,
      title,
      contents,
      articleTypeCode,
      isDisplayCode,
      register,
      registDate: Date.now(),
    };

    // step3: DB article 테이블에 데이터를 등록하고 등록된 데이터가 반환된다.
    const savedArticle = {
      article_id: 1,
      board_type_code: 1,
      title: '공지게시글 1번글입니다.',
      contents: '공지게시글 1번 내용입니다.',
      view_count: 12,
      ip_address: '111.111.124.44',
      is_display_code: 1,
      reg_date: '2023-12-12',
      reg_member_id: 'nara',
    };

    apiResult.code = 200;
    apiResult.data = savedArticle;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 단일 게시글 수정처리 API 라우팅 메소드
// http://localhost:3000/api/article/update
router.post('/update', async (req, res) => {
  // API 라우팅 메소드 반환형식 정의
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    // step1: 사용자가 수정한 게시글 JSON 데이터 추출하기
    const { articleIdx, boardTypeCode, title, contents, articleTypeCode, isDisplayCode, register } = req.body;

    // step2: 추출된 사용자 수정 데이터를 단일 게시글 json데이터로 구성해서
    // DB article 테이블에 수정처리 반영한다.
    // 수정처리 후 적용 '건수'가 반환됨.

    // 수정할 게시글 데이터
    const article = {
      articleIdx,
      boardTypeCode,
      title,
      contents,
      articleTypeCode,
      isDisplayCode,
      register,
      registDate: Date.now(),
    };

    // step3: 수정처리 후 처리건수 반환.
    const affectedCnt = 1; // DB 수정처리 후 DB로부터 적용건수 1이 반환되었다고 가정함.

    // step4: 정상 수정된 정보를 apiResult객체에 바인딩함
    apiResult.code = 200;
    apiResult.data = affectedCnt;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = 0;
    apiResult.result = 'Failed';
  }
  res.json(apiResult);
});

// 단일 게시글 데이터 조회 반환 API 라우팅 메소드
// http://localhost:3000/api/article/1
router.get('/:aidx', async (req, res) => {
  // API 라우팅 메소드 반환형식 정의
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    // step1: url을 통해 전달된 게시글 고유번호를 추출
    const articleIdx = req.params.aidx;

    // step2: 게시글 고유번호에 해당하는 단일 게시글 정보를 DB에서 조회
    const article = {
      article_id: 1,
      board_type_code: 1,
      title: '공지게시글 1번글입니다.',
      contents: '공지게시글 1번 내용입니다.',
      view_count: 12,
      ip_address: '111.111.124.44',
      is_display_code: 1,
      article_type_code: 1,
      reg_date: '2023-12-12',
      reg_member_id: 'nara',
    };

    // step3: 정상 조회된 정보를 apiResult 객체에 바인딩함.
    apiResult.code = 200;
    apiResult.data = article;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

// 단일 게시글 삭제처리 API 라우팅 메소드
// http://localhost:3000/api/article/1
router.delete('/:aidx', async (req, res) => {
  // API 라우팅 메소드 반환형식 정의
  const apiResult = {
    code: 200,
    data: [],
    result: 'ok',
  };

  try {
    // step1: url주소에서 게시글 고유번호를 추출
    const articleIdx = req.params.aidx;

    // step2: DB의 article테이블에서 해당 게시글 번호글을 완전삭제처리

    // step3: DB에서 삭제된 건수가 넘어옴
    const deletedCnt = 1;

    // step4: 정상 삭제된 정보를 apiResult객체 바인딩함
    apiResult.code = 200;
    apiResult.data = deletedCnt;
    apiResult.result = 'ok';
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = 0;
    apiResult.result = 'Failed';
  }

  res.json(apiResult);
});

module.exports = router;
