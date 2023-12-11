// 라우터의 기본주소
// http://localhost:3000/articles/~
const express = require('express');
const router = express.Router();

/*
  기능: 게시글 목록 웹페이지 요청과 응답처리 라우팅메소드
  요청URL: http://localhost:3000/articles
  요청유형: GET
  응답결과: 게시글 목록 웹페이지
*/
router.get('/', async (req, res, next) => {
  // 게시글 목록 데이터
  // 나중에 DB에서 가져옵니다.
  const articles = [
    {
      articleIdx: 1,
      title: '최초 게시글입니다.',
      contents: '최초 게시글 내용',
      view_cnt: 100,
      display: 'Y',
      ipaddress: '111.111.111.111',
      registDate: Date.now(),
      registMemberId: 'nara',
    },
    {
      articleIdx: 2,
      title: '두번째 게시글 제목',
      contents: '2게시글 내용',
      view_cnt: 200,
      display: 'Y',
      ipaddress: '222.111.111.111',
      registDate: Date.now(),
      registMemberId: 'nara2',
    },
    {
      articleIdx: 3,
      title: '세번째 게시글 제목',
      contents: '3게시글 내용',
      view_cnt: 300,
      display: 'Y',
      ipaddress: '333.111.111.111',
      registDate: Date.now(),
      registMemberId: 'nara3',
    },
  ];

  res.render('article/list.ejs', { articles });
});

/*
  기능: 신규 게시글 등록 웹페이지 요청과 응답 처리 라우팅 메소드
  요청URL: http://localhost:3000/articles/create
  요청유형: GET
  응답결과: 신규 게시글 등록 웹페이지
*/
router.get('/create', async (req, res, next) => {
  res.render('article/create');
});

/*
  기능: 신규 게시글 사용자 입력정보 등록 요청과 응답 처리 라우팅 메소드
  요청URL: http://localhost:3000/articles/create
  요청유형: POST
  응답결과: 게시글 목록 페이지로 이동하기
*/
router.post('/create', async (req, res, next) => {
  const { title, contents, register } = req.body;

  // DB 단일 데이터 생성 및 DB 등록처리
  const article = {
    articleIdx: 1,
    title,
    contents,
    view_cnt: 0,
    display: 'Y',
    ipaddress: '111.111.111.111',
    registDate: Date.now(),
    registMemberId: register,
  };

  console.log('게시글 생성!!!', article);

  res.redirect('/articles');
});

/*
  기능: 선택 게시글 정보확인 웹페이지 요청과 응답처리 라우팅 메서드
  요청URL: http://localhost:3000/articles/modify/1
  요청유형: GET
  응답결과: 선택 단일 게시글 정보 표시 웹페이지
*/
router.get('/modify/:aid', async (req, res, next) => {
  // step1: url을 통해 전달된 게시글 고유번호 추출
  const articleIdx = req.params.aid;

  // step2: 게시글 고유번호를 이용해 DB에서 게시글 정보를 조회해온다.
  const article = {
    articleIdx,
    title: '1번째 게시글 제목',
    contents: '1번째 게시글 내용입니다.',
    view_cnt: 100,
    display: 'Y',
    ipaddress: '111.111.111.111',
    registDate: Date.now(),
    registMemberId: 'nara',
  };

  // step3: 조회해본 단일 게시글 정보..
  res.render('article/modify', { article });
});

/*
  기능: 게시글 수정 페이지에서 사용자가 수정한 게시글 수정 정보 처리 요청과 응답 메서드
  요청URL: http://localhost:3000/articles/modify/1
  요청유형: POST
  응답결과: 게시글 목록 웹페이지
*/
router.post('/modify/:aid', async (req, res, next) => {
  const articleIdx = req.params.aid;

  const { title, contents, register } = req.body;

  // DB 수정 단일 데이터 생성 및 DB 수정처리
  const article = {
    articleIdx,
    title,
    contents,
    view_cnt: 0,
    display: 'Y',
    ipaddress: '111.111.111.111',
    registDate: Date.now(),
    registMemberId: register,
  };

  res.redirect('/articles');
});

/*
  기능: 게시글 삭제 요청과 응답 처리 라우팅 메소드
  요청URL: http://localhost:3000/articles/delete?aidx=1
  요청유형: GET
  응답결과: 게시글 목록 웹페이지
*/
router.get('/delete', async (req, res, next) => {
  const articleIdx = req.query.aidx;

  // 해당 게시글 번호를 이용해 DB에서 해당 게시글 삭제한다.

  // 삭제 완료후 게시글 목록 페이지로 이동한다.

  res.redirect('/articles');
});

module.exports = router;
