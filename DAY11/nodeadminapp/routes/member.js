var express = require('express');
var router = express.Router();

const memberList = [
  {
    member_id: 1,
    email: 'momo@naver.com',
    name: '모모',
    telephone: '010131311',
  },
  {
    member_id: 2,
    email: 'jojo@naver.com',
    name: '조조',
    telephone: '010222222',
  },
  {
    member_id: 3,
    email: 'toto@naver.com',
    name: '토토',
    telephone: '010333333',
  },
];

/* GET home page. */
router.get('/list', function (req, res, next) {
  res.render('member/list', { memberList });
});

router.get('/create', function (req, res, next) {
  res.render('member/create', { title: 'Express' });
});

router.post('/create', function (req, res, next) {
  res.redirect('/member/list');
});

router.get('/modify', function (req, res, next) {
  res.render('member/modify', { title: 'Express' });
});

router.post('/modify', function (req, res, next) {
  res.redirect('/member/list');
});

router.get('/delete', function (req, res, next) {
  res.redirect('/member/list');
});

module.exports = router;
