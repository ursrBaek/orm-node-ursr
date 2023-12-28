var express = require('express');
var router = express.Router();

const messageList = [
  {
    channel_id: 1,
    member_id: 1,
    nick_name: '봉봉',
    message: '밥먹자',
  },
  {
    channel_id: 1,
    member_id: 2,
    nick_name: '구구',
    message: '그래',
  },
  {
    channel_id: 1,
    member_id: 1,
    nick_name: '봉봉',
    message: '뭐먹을래',
  },
];

/* GET home page. */
router.get('/list', function (req, res, next) {
  res.render('message/list', { messageList });
});

router.get('/create', function (req, res, next) {
  res.render('message/create', { title: 'Express' });
});

router.post('/create', function (req, res, next) {
  res.redirect('/message/list');
});

router.get('/modify/:mid', function (req, res, next) {
  res.render('message/modify', { title: 'Express' });
});

router.post('/modify', function (req, res, next) {
  res.redirect('/message/list');
});

router.get('/delete', function (req, res, next) {
  res.redirect('/message/list');
});

module.exports = router;
