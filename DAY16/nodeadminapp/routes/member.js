var express = require('express');
var router = express.Router();

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

/* GET home page. */
router.get('/list', function (req, res, next) {
  res.render('member/list', { memberList, searchOption: {} });
});

router.post('/list', function (req, res, next) {
  const { name, email, telephone } = req.body;
  const searchOption = { name, email, telephone };
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
  ];
  res.render('member/list', { memberList, searchOption });
});

router.get('/create', function (req, res, next) {
  res.render('member/create', { title: 'Express' });
});

router.post('/create', function (req, res, next) {
  res.redirect('/member/list');
});

router.get('/modify/:mid', function (req, res, next) {
  const memberIdx = req.params.mid;

  const member = {
    member_id: 1,
    member_password: '1234',
    email: 'momo@naver.com',
    name: '모모',
    telephone: '010131311',
    birth_date: '1991.11.11',
    use_state_code: 1,
    reg_date: '2021-11-22',
  };

  res.render('member/modify', { member });
});

router.post('/modify/:mid', function (req, res, next) {
  const memberIdx = req.params.mid;
  res.redirect('/member/list');
});

router.get('/delete', function (req, res, next) {
  res.redirect('/member/list');
});

module.exports = router;
