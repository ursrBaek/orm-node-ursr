// 관리자 사이트 관리자 계정 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

var db = require('../models');
const Op = db.Sequelize.Op;

/* GET home page. */
router.get('/list', async function (req, res, next) {
  const adminList = await db.Admin.findAll();

  res.render('admin/list', { adminList, searchOption: {} });
});

router.post('/list', async function (req, res, next) {
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

  const adminList = await db.Admin.findAll({ where: queryOptionObj });

  res.render('admin/list', { adminList, searchOption });
});

router.get('/create', function (req, res, next) {
  res.render('admin/create');
});

router.post('/create', async function (req, res, next) {
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
    reg_user_id: 1,
  };

  await db.Admin.create(admin);

  res.redirect('/admin/list');
});

router.get('/modify/:aid', async function (req, res, next) {
  const admin_member_id = req.params.aid;

  const admin = await db.Admin.findOne({ where: { admin_member_id } });

  res.render('admin/modify', { admin });
});

router.post('/modify/:aid', async function (req, res, next) {
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

router.get('/delete', async function (req, res, next) {
  const admin_member_id = req.query.aid;

  var deletedCnt = await db.Admin.destroy({ where: { admin_member_id } });

  res.redirect('/admin/list');
});

module.exports = router;
