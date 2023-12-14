// 게시글 정보관리 각종 웹페이지 요청과 응답처리 라우터 정의
// http://localhost:3000/article/~

var express = require('express');
var router = express.Router();

// 게시글 목록 조회 웹페이지 요청 및 응답 라우팅 메소드
router.get('/list', async (req, res) => {
  // step1: DB에서 모든 게시글 데이터 목록을 조회해옵니다.
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

  // step2: 게시글 전체 목록을 List.ejs뷰에 전달한다.
  res.render('article/list.ejs', { articles });
});

// 게시글 목록에서 조회옵션 데이터를 전달받아 조회옵션기반 게시글 목록 조회 후
// 게시글 목록 페이지에 대한 요청과 응답처리
router.post('/list', async (req, res) => {
  // step1: 사용자가 선택/입력한 조회옵션 데이터를 추출
  const { boardTypeCode, title, isDisplayCode } = req.body;

  // step2: 사용자가 입력/선택한 조회옵션 데이터를 기반으로 DB에서 게시글 목록 재조회 해오기
  const articles = [
    {
      article_id: 1,
      board_type_code: 1,
      title: '옵션반영 1번글입니다.',
      contents: '공지게시글 1번 내용입니다.',
      view_count: 12,
      ip_address: '111.111.124.44',
      is_display_code: 1,
      reg_date: '2023-12-12',
      reg_member_id: 'nara',
    },
  ];

  // step3: 게시글 목록 페이지 list.ejs에 데이터 목록을 전달한다.
  res.render('article/list.ejs', { articles });
});

// 신규 게시글 등록 웹페이지 요청 및 응답 라우팅 메소드
router.get('/create', async (req, res) => {
  res.render('article/create', {});
});

// 신규 게시글 사용자 등록정보 처리 요청 및 응답 라우팅 메소드
router.post('/create', async (req, res) => {
  res.redirect('/article/list');
});

// 기존 게시물 삭제처리 요청 및 응답 라우팅 메소드
// http://localhost:3000/article/delete?aid=3
router.get('/delete', async (req, res) => {
  const articleIdx = req.query.aid;

  res.render('article/list');
});

// 기존 게시글 정보 확인 및 수정 웹페이지 요청과 응답 라우팅 메소드
router.get('/modify/:aid', async (req, res) => {
  const articleIdx = req.params.aid;

  res.render('article/modify', {});
});

// 기존 게시글 사용자 수정정보 처리 요청과 응답 라우팅 메소드
router.post('/modify/:aid', async (req, res) => {
  const articleIdx = req.params.aid;

  res.redirect('/article/list');
});

module.exports = router;
