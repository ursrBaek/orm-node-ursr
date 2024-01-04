var express = require('express');
var router = express.Router();
var moment = require('moment');

const Member = require('../schemas/models/member');

// /* GET home page. */
router.get('/list', async function (req, res, next) {
  const memberList = await Member.find({});

  res.render('member/list', { memberList, searchOption: {}, moment });
});

router.post('/list', async function (req, res, next) {
  const { name, email, use_state_code } = req.body;
  const searchOption = { name, email, use_state_code: use_state_code == '9' ? '' : use_state_code };

  const queryOptionObj = {};

  for (let key in searchOption) {
    if (searchOption[key]) {
      queryOptionObj[key] = searchOption[key];
    }
  }

  const memberList = await Member.find({ ...queryOptionObj });

  res.render('member/list', { memberList, searchOption, moment });
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
    profile_img_path: 'www.abc.com/img.jpg',
    telephone,
    entry_type_code,
    use_state_code,
    birth_date,
    reg_date: Date.now(),
    reg_member_id: 2,
  };

  await Member.create(newMember);

  res.redirect('/member/list');
});

router.get('/modify/:mid', async function (req, res, next) {
  const member_id = req.params.mid;

  const member = await Member.findOne({ member_id });

  res.render('member/modify', { member, moment });
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

  await Member.updateOne({ member_id }, member);

  res.redirect('/member/list');
});

router.get('/delete', async function (req, res, next) {
  const member_id = req.query.mid;

  await Member.deleteOne({ member_id });

  res.redirect('/member/list');
});

module.exports = router;
