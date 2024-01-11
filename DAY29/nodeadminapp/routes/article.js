// 게시글 정보관리 각종 웹페이지 요청과 응답처리 라우터 정의
// http://localhost:3000/article/~

var express = require('express');
var router = express.Router();

const moment = require('moment');

var multer = require('multer');

// S3전용 업로드 객체 참조하기
var { upload } = require('../common/aws_s3.js');

//파일저장위치 지정
var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/upload/');
  },
  filename(req, file, cb) {
    cb(null, `${moment(Date.now()).format('YYYYMMDDHHMMss')}_${file.originalname}`);
  },
});

//일반 업로드처리 객체 생성
var simpleUpload = multer({ storage: storage });

var db = require('../models');
const { QueryTypes } = require('sequelize');
var sequelize = db.sequelize;
const Op = db.Sequelize.Op;

// 게시글 목록 조회 웹페이지 요청 및 응답 라우팅 메소드
router.get('/list', async (req, res) => {
  var searchOption = {
    borderTypeCode: '0',
    title: '',
    isDisplayCode: '9',
  };
  // step1: DB에서 모든 게시글 데이터 목록을 조회해옵니다.
  // db.Article.findAll()메서드는 article테이블에 모든 데이터 조회하는
  // SELECT article_id,,, FROM article WHERE is_display_code=1 AND view_count !=0; SQL 쿼리로 변환되어 DB서버에 전달되어 실행되고 그 결과물을 반환함
  // var articles = await db.Article.findAll({
  //   attributes: [
  //     'article_id',
  //     'board_type_code',
  //     'title',
  //     'article_type_code',
  //     'view_count',
  //     'ip_address',
  //     'is_display_code',
  //     'reg_date',
  //     'reg_member_id',
  //   ],
  //   // where: { is_display_code: 1, view_count: { [Op.not]: 0 } },
  //   order: [['article_id', 'ASC']], // DESC 오름차순: 3, 2, 1, ASC 내림차순: 1, 2, 3
  // });

  // var sqlQuery = `SELECT article_id, board_type_code, title, article_type_code, view_count, ip_address, is_display_code, reg_date, reg_member_id FROM article
  // WHERE is_display_code = 1
  // ORDER BY article_id ASC;`;

  // var articles = await sequelize.query(sqlQuery, {
  //   raw: true,
  //   type: QueryTypes.SELECT,
  // });

  // 저장프로시저 사용하여 쿼리 실행
  var articles = await sequelize.query('CALL SP_CHAT_ARTICLE_DISPLAY (:P_DISPLAY_CODE)', {
    replacements: { P_DISPLAY_CODE: 1 },
  });

  // SELECT Count(*) FROM articles SQL쿼리로 생성됨...
  var articleCount = await db.Article.count();

  // step2: 게시글 전체 목록을 List.ejs뷰에 전달한다.
  res.render('article/list.ejs', { articles, searchOption, articleCount });
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
  // SELECT * FROM article WHERE board_type_code = 1 SQL구문으로 변환되어 DB서버에 전달 실행
  var articles = await db.Article.findAll({ where: { is_display_code: isDisplayCode } });

  var articleCount = await db.Article.count();

  // step3: 게시글 목록 페이지 list.ejs에 데이터 목록을 전달한다.
  res.render('article/list.ejs', { articles, searchOption, articleCount });
});

// 신규 게시글 등록 웹페이지 요청 및 응답 라우팅 메소드
router.get('/create', async (req, res) => {
  res.render('article/create', {});
});

// 신규 게시글 사용자 등록정보 처리 요청 및 응답 라우팅 메소드
// upload.single('html태그내 file타입인 input의 태그의 name명')
router.post('/create', simpleUpload.single('file'), async (req, res) => {
  // step1: 사용자가 입력한 게시글 등록 데이터 추출
  const { boardTypeCode, title, contents, articleTypeCode, isDisplayCode, register } = req.body;

  // step2: 추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해서
  // DB article 테이블에 영구적으로 저장처리한다.
  // 저장처리 후 article 테이블에 저장된 데이터 반환됩니다.

  // 등록할 게시글 데이터
  // 중요~!!! 테이블에 저장/수정할 데이터소스는 반드시 데이터모델의 속성명을 이용해야한다.
  // 주의 ~ ! article 모델 컬럼에 값이 반드시  들어와야하는 값(IS NOT NULL)
  const article = {
    board_type_code: boardTypeCode,
    title,
    contents,
    view_count: 0,
    ip_address: '111.222.222.222',
    article_type_code: articleTypeCode,
    is_display_code: isDisplayCode,
    reg_member_id: 1,
    reg_date: Date.now(),
  };

  // step3: 게시글 정보를 db서버의 article테이블에 저장하고 저장된 값을 다시 반환받는다.
  const registedArticle = await db.Article.create(article);

  // step1-2: 업로드 파일 추출
  const uploadFile = req.file;

  // 업로드된 파일이 존재하는 경우만 데이터처리
  if (uploadFile) {
    var filePath = '/upload/' + uploadFile.filename; // 서버에 실제 업로드된 물리적 파일명-('/upload/')도메인주소가 생략된 파일링크주소
    var fileName = uploadFile.filename; // 서버에 실제 업로드된 물리적 파일명
    var fileOrignalName = uploadFile.originalname; // 클라이언트에서 선택한 오리지널 파일명
    var fileSize = uploadFile.size; // 파일크기 (kb)
    var fileType = uploadFile.mimetype; // 파일포맷

    const file = {
      article_id: registedArticle.article_id,
      file_name: fileOrignalName,
      file_size: fileSize,
      file_path: filePath,
      file_type: fileType,
      reg_date: Date.now(),
      reg_member_id: 1,
    };

    await db.ArticleFile.create(file);
  }

  // step4: 게시글 목록 웹페이지로 이동처리
  res.redirect('/article/list');
});

// 신규 게시글 사용자 등록정보 처리 요청 및 응답 라우팅 메소드 - S3에 파일 업로드
router.post('/creates3', upload.getUpload('upload/').fields([{ name: 'file', maxCount: 1 }]), async (req, res) => {
  // step1: 사용자가 입력한 게시글 등록 데이터 추출
  const { boardTypeCode, title, contents, articleTypeCode, isDisplayCode, register } = req.body;

  // step1-2: 업로드 파일 추출
  const uploadFile = req.files.file[0];
  var filePath = '/upload/' + uploadFile.filename; // 서버에 실제 업로드된 물리적 파일명-('/upload/')도메인주소가 생략된 파일링크주소
  var fileName = uploadFile.filename; // 서버에 실제 업로드된 물리적 파일명
  var fileOrignalName = uploadFile.originalname; // 클라이언트에서 선택한 오리지널 파일명
  var fileSize = uploadFile.size; // 파일크기 (kb)
  var fileType = uploadFile.mimetype; // 파일포맷

  // step2: 추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해서
  // DB article 테이블에 영구적으로 저장처리한다.
  // 저장처리 후 article 테이블에 저장된 데이터 반환됩니다.

  // 등록할 게시글 데이터
  // 중요~!!! 테이블에 저장/수정할 데이터소스는 반드시 데이터모델의 속성명을 이용해야한다.
  // 주의 ~ ! article 모델 컬럼에 값이 반드시  들어와야하는 값(IS NOT NULL)
  const article = {
    board_type_code: boardTypeCode,
    title,
    contents,
    view_count: 0,
    ip_address: '111.222.222.222',
    article_type_code: articleTypeCode,
    is_display_code: isDisplayCode,
    reg_member_id: 1,
    reg_date: Date.now(),
  };

  // step3: 게시글 정보를 db서버의 article테이블에 저장하고 저장된 값을 다시 반환받는다.
  const registedArticle = await db.Article.create(article);

  // step4: 게시글 목록 웹페이지로 이동처리
  res.redirect('/article/list');
});

// 기존 게시물 삭제처리 요청 및 응답 라우팅 메소드
// http://localhost:3000/article/delete?aid=3
router.get('/delete', async (req, res) => {
  // step1: 삭제하려는 게시글 고유번호 추출
  const article_id = req.query.aid;

  // step2: 추출한 게시번호 기반으로 실제 DB article 테이블에서 데이터를 삭제처리.
  var deletedCnt = await db.Article.destroy({ where: { article_id } });

  // step3: 게시글 목록 페이지로 이동시킨다.
  res.redirect('/article/list');
});

// 기존 게시글 정보 확인 및 수정 웹페이지 요청과 응답 라우팅 메소드
// http://localhost:3000/article/modify/3
router.get('/modify/:aid', async (req, res) => {
  // step1: 선택한 게시글 고유번호를 파라미터 방식으로 URL을 통해 전달받음
  const article_id = req.params.aid;

  // step2: 해당 게시글 번호에 해당하는 특정 단일 게시글 정보를 DB article테이블에서
  // 조회해온다.
  const article = await db.Article.findOne({ where: { article_id } });

  // 동적 속성을 추가함
  // 댓글목록 데이터를 추가적으로 DB에서 가져와서 article 객체에 동적으로 추가해줄 수 있음.
  article.comments = [
    { comment_id: 1, comment: '댓글1' },
    { comment_id: 2, comment: '댓글2' },
  ];

  // step3: 단일 게시글 정보를 뷰에 전달한다.
  res.render('article/modify', { article });
});

// 기존 게시글 사용자 수정정보 처리 요청과 응답 라우팅 메소드
// http://localhost:3000/article/modify/1
// POST
router.post('/modify/:aid', async (req, res) => {
  // 게시글 고유번호 URL 파라미터에서 추출
  const article_id = req.params.aid;

  // step1: 사용자가 입력한 게시글 등록 데이터 추출
  const { boardTypeCode, title, contents, articleTypeCode, isDisplayCode, register } = req.body;

  // step2: 추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해서
  // DB article 테이블에 수정처리한다.
  // 수정처리 후 처리건수값이 반환됩니다.

  // 수정할 게시글 데이터
  const article = {
    board_type_code: boardTypeCode,
    title,
    contents,
    article_type_code: articleTypeCode,
    is_display_code: isDisplayCode,
    ip_address: '111.333.444.555',
    edit_member_id: 1,
    edit_date: Date.now(),
  };

  // DB article 테이블의 컬럼내용들 수정처리하고 수정건수 받기
  // await db.Article.update(수정할데이터, 조건)은
  // UPDATE article SET board_type_code=1, title="...", contents=""/// WHERE article_id=1; SQL이 생성되어
  // DB서버로 전달되어 수정되고 수정된 건수가 배열로 전달된다.
  var updatedCount = await db.Article.update(article, { where: { article_id } });

  // step3: 등록처리 후 게시글 목록 웹페이지로 이동처리
  res.redirect('/article/list');
});

module.exports = router;
