// 관리자 사이트 관리자 계정 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

// bcryptjs 단방향 암호화 패키지 참조하기
const bcrypt = require('bcryptjs');

// aes 양방향 암호화 패키지 참조하기
const AES = require('mysql-aes');

// 미들웨어 참조
const { isLoggedIn, isNotLoggedIn } = require('./sessionMiddleware');

/*
기능: 관리자 계정 목록 조회 웹페이지 요청
호출주소: http://localhost:3000/admin/list
 */

var db = require('../models');

var sequelize = db.sequelize;
const { QueryTypes } = sequelize;

/* GET home page. */
router.get('/list', isLoggedIn, async function (req, res, next) {
  const adminList = await db.Admin.findAll();

  res.render('admin/list', { adminList, searchOption: {} });
});

router.post('/list', isLoggedIn, async function (req, res, next) {
  const { admin_name, admin_id, used_yn_code } = req.body;

  const searchOption = {
    admin_name,
    admin_id,
    used_yn_code: used_yn_code === '9' ? '' : used_yn_code,
  };

  const queryOptionObj = {};

  for (let key in searchOption) {
    if (searchOption[key]) {
      queryOptionObj[key] = searchOption[key];
    }
  }
  console.log('옵션!: ', queryOptionObj, searchOption);
  var sqlQuery = `SELECT 
    admin_member_id,company_code,admin_id,admin_password,admin_name,
    CONVERT(AES_DECRYPT(UNHEX(email),'${process.env.MYSQL_AES_KEY}')USING utf8) as email,
    CONVERT(AES_DECRYPT(UNHEX(telephone),'${process.env.MYSQL_AES_KEY}')USING utf8) as telephone,
    dept_name,used_yn_code,reg_date,reg_user_id 
    FROM admin_member;`;

  var adminList = await sequelize.query(sqlQuery, {
    raw: true,
    type: QueryTypes.SELECT,
  });

  // const adminList = await db.Admin.findAll({ where: queryOptionObj });

  res.render('admin/list', { adminList, searchOption });
});

router.get('/create', isLoggedIn, function (req, res, next) {
  res.render('admin/create');
});

router.post('/create', isLoggedIn, async function (req, res, next) {
  const { admin_id, admin_password, admin_name, email, telephone, company_code, dept_name, used_yn_code } = req.body;

  // 관리자 암호를 해시알고리즘 기반 단방향 암호화 적용하기
  // bcrypt.hash('암호화 할 문자', 암호화 변환 횟수);
  const encryptedPassword = await bcrypt.hash(admin_password, 12);

  // 메일주소/전화번호 개인정보 양방향 암호화(AES) 적용하기
  // AES.encrypt(암호화 할 문자 , 암호화 보안키 값)
  const encryptedEmail = AES.encrypt(email, process.env.MYSQL_AES_KEY);
  const encryptedTelephone = AES.encrypt(telephone, process.env.MYSQL_AES_KEY);

  const admin = {
    admin_id,
    admin_password: encryptedPassword,
    admin_name,
    email: encryptedEmail,
    telephone: encryptedTelephone,
    company_code,
    dept_name,
    used_yn_code,
    reg_user_id: 1,
  };

  await db.Admin.create(admin);

  res.redirect('/admin/list');
});

router.get('/modify/:aid', isLoggedIn, async function (req, res, next) {
  const admin_member_id = req.params.aid;

  const admin = await db.Admin.findOne({ where: { admin_member_id } });
  admin.email = AES.decrypt(admin.email, process.env.MYSQL_AES_KEY);
  admin.telephone = AES.decrypt(admin.telephone, process.env.MYSQL_AES_KEY);

  res.render('admin/modify', { admin });
});

router.post('/modify/:aid', isLoggedIn, async function (req, res, next) {
  const admin_member_id = req.params.aid;

  const { admin_id, admin_password, admin_name, email, telephone, company_code, dept_name, used_yn_code } = req.body;

  const admin = {
    admin_id,
    admin_password,
    admin_name,
    email,
    telephone,
    company_code,
    dept_name,
    used_yn_code,
    edit_user_id: 2,
    edit_date: Date.now(),
  };

  await db.Admin.update(admin, { where: { admin_member_id } });

  res.redirect('/admin/list');
});

router.get('/delete', isLoggedIn, async function (req, res, next) {
  const admin_member_id = req.query.aid;

  var deletedCnt = await db.Admin.destroy({ where: { admin_member_id } });

  res.redirect('/admin/list');
});

module.exports = router;
