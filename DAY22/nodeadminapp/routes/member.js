var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET home page. */
router.get('/list', async function (req, res, next) {
  const memberList = await db.Member.findAll();
  res.render('member/list', { memberList, searchOption: {} });
});

router.post('/list', async function (req, res, next) {
  const { name, email, telephone } = req.body;
  const searchOption = { name, email, telephone };

  const queryOptionObj = {};

  for (let key in searchOption) {
    if (searchOption[key]) {
      queryOptionObj[key] = searchOption[key];
    }
  }

  const memberList = await db.Member.findAll({ where: queryOptionObj });

  res.render('member/list', { memberList, searchOption });
});

router.get('/create', function (req, res, next) {
  res.render('member/create', {});
});

router.post('/create', async function (req, res, next) {
  const { email, member_password, name, profile_img_path, telephone, entry_type_code, use_state_code, birth_date } =
    req.body;

  const newMember = {
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code,
    use_state_code,
    birth_date,
    reg_date: Date.now(),
    reg_member_id: 2,
  };

  await db.Member.create(newMember);

  res.redirect('/member/list');
});

router.get('/modify/:mid', async function (req, res, next) {
  const member_id = req.params.mid;

  const member = await db.Member.findOne({ where: { member_id } });

  res.render('member/modify', { member });
});

router.post('/modify/:mid', async function (req, res, next) {
  const member_id = req.params.mid;

  const { email, member_password, name, profile_img_path, telephone, entry_type_code, use_state_code, birth_date } =
    req.body;

  const member = {
    email,
    member_password,
    name,
    profile_img_path,
    telephone,
    entry_type_code,
    use_state_code,
    birth_date,
    edit_member_id: 20,
    edit_date: Date.now(),
  };

  await db.Member.update(member, { where: { member_id } });

  res.redirect('/member/list');
});

router.get('/delete', async function (req, res, next) {
  const member_id = req.query.mid;

  await db.Member.destroy({ where: { member_id } });

  res.redirect('/member/list');
});

module.exports = router;
