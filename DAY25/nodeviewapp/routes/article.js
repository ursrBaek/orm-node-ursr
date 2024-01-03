// 게시글 정보관리 각종 웹페이지 요청과 응답처리 라우터 정의
// http://localhost:3000/article/~

var express = require('express');
var router = express.Router();
var moment = require('moment');

const Article = require('../schemas/article');

// 게시글 목록 조회 웹페이지 요청 및 응답 라우팅 메소드
router.get('/list', async (req, res) => {
  const searchOption = {
    boardTypeCode: '0',
    title: '',
    isDisplayCode: '9',
  };

  // step1: DB에서 모든 게시글 데이터 목록을 조회해옵니다.
  const articles = await Article.find({});

  // step2: 게시글 전체 목록을 List.ejs뷰에 전달한다.
  res.render('article/list.ejs', { articles, searchOption, moment });
});

// 게시글 목록에서 조회옵션 데이터를 전달받아 조회옵션기반 게시글 목록 조회 후
// 게시글 목록 페이지에 대한 요청과 응답처리
router.post('/list', async (req, res) => {
  // step1: 사용자가 선택/입력한 조회옵션 데이터를 추출
  const { boardTypeCode, title, isDisplayCode } = req.body;

  const searchOption = {
    boardTypeCode,
    title,
    isDisplayCode,
  };

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
  res.render('article/list.ejs', { articles, searchOption });
});

// 신규 게시글 등록 웹페이지 요청 및 응답 라우팅 메소드
router.get('/create', async (req, res) => {
  res.render('article/create', {});
});

// 신규 게시글 사용자 등록정보 처리 요청 및 응답 라우팅 메소드
router.post('/create', async (req, res) => {
  // step1: 사용자가 입력한 게시글 등록 데이터 추출
  const { boardTypeCode, title, contents, articleTypeCode, isDisplayCode, register } = req.body;

  // step2: 추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해서
  // DB article 테이블에 영구적으로 저장처리한다.
  // 저장처리 후 article 테이블에 저장된 데이터 반환됩니다.

  // 등록할 게시글 데이터
  const newArticle = {
    title,
    contents,
    article_type_code: articleTypeCode,
    view_count: 0,
    is_display_code: isDisplayCode,
    edit_date: Date.now(),
    edit_member_id: 1,
  };

  // step3: 등록처리 후 게시글 목록 웹페이지로 이동처리

  const article = await Article.create(newArticle);

  res.redirect('/article/list');
});

// 기존 게시물 삭제처리 요청 및 응답 라우팅 메소드
// http://localhost:3000/article/delete?aid=3
router.get('/delete', async (req, res) => {
  // step1: 삭제하려는 게시글 고유번호 추출
  const articleIdx = req.query.aid;

  // step2: 추출한 게시번호 기반으로 실제 DB article 테이블에서 데이터를 삭제처리.
  const result = await Article.deleteOne({ article_id: articleIdx });
  // step3: 게시글 목록 페이지로 이동시킨다.
  res.redirect('/article/list');
});

// 기존 게시글 정보 확인 및 수정 웹페이지 요청과 응답 라우팅 메소드
// http://localhost:3000/article/modify/3
router.get('/modify/:aid', async (req, res) => {
  // step1: 선택한 게시글 고유번호를 파라미터 방식으로 URL을 통해 전달받음
  const articleIdx = req.params.aid;

  // step2: 해당 게시글 번호에 해당하는 특정 단일 게시글 정보를 DB article테이블에서
  // 조회해온다.
  // mongoose의 find 메서드는 배열을 반환.
  const articles = await Article.find({ article_id: articleIdx });

  var article = {};
  if (articles.length > 0) {
    article = articles[0];
  }
  // step3: 단일 게시글 정보를 뷰에 전달한다.
  res.render('article/modify', { article });
});

// 기존 게시글 사용자 수정정보 처리 요청과 응답 라우팅 메소드
// http://localhost:3000/article/modify/1
// POST
router.post('/modify/:aid', async (req, res) => {
  // 게시글 고유번호 URL 파라미터에서 추출
  const articleIdx = req.params.aid;

  // step1: 사용자가 입력한 게시글 등록 데이터 추출
  const { boardTypeCode, title, contents, articleTypeCode, isDisplayCode, register } = req.body;

  // step2: 추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해서
  // DB article 테이블에 수정처리한다.
  // 수정처리 후 처리건수값이 반환됩니다.

  // 등록할 게시글 데이터
  const article = {
    title,
    contents,
    article_type_code: articleTypeCode,
    is_display_code: isDisplayCode,
    edit_date: Date.now(),
    edit_member_id: 1,
  };

  const result = await Article.updateOne({ article_id: articleIdx }, article);

  // step3: 등록처리 후 게시글 목록 웹페이지로 이동처리
  res.redirect('/article/list');
});

module.exports = router;
