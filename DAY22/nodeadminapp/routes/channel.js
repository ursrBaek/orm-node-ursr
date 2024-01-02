// 채팅방 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

var db = require('../models');

router.get('/list', async function (req, res, next) {
  const channelList = await db.Channel.findAll();

  res.render('channel/list', { channelList, searchOption: {} });
});

router.post('/list', async function (req, res, next) {
  // step1: 사용자가 선택/입력한 조회옵션 데이터를 추출
  const { channel_name, reg_member_id, channel_state_code } = req.body;

  const searchOption = {
    channel_name,
    reg_member_id,
    channel_state_code: channel_state_code === '9' ? '' : channel_state_code,
  };

  const queryOptionObj = {};

  for (let key in searchOption) {
    if (searchOption[key]) {
      queryOptionObj[key] = searchOption[key];
    }
  }

  const channelList = await db.Channel.findAll({ where: queryOptionObj });

  res.render('channel/list', { channelList, searchOption });
});

router.get('/create', function (req, res, next) {
  res.render('channel/create');
});

router.post('/create', async function (req, res, next) {
  const { community_id, category_code, channel_name, channel_state_code, user_limit, channel_desc } = req.body;

  const newChannel = {
    community_id,
    category_code,
    channel_name,
    channel_state_code,
    user_limit,
    channel_desc,
    channel_img_path: 'a',
    reg_member_id: 100,
    reg_date: Date.now(),
  };

  await db.Channel.create(newChannel);
  res.redirect('/channel/list');
});

router.get('/modify/:cid', async function (req, res, next) {
  const channel_id = req.params.cid;

  const channel = await db.Channel.findOne({ where: { channel_id } });

  res.render('channel/modify', { channel });
});

router.post('/modify/:cid', async function (req, res, next) {
  const channel_id = req.params.cid;

  const { community_id, category_code, channel_name, channel_state_code, user_limit, channel_desc } = req.body;

  const newChannel = {
    community_id,
    category_code,
    channel_name,
    channel_state_code,
    user_limit,
    channel_desc,
    channel_img_path: 'a',
    edit_member_id: 222,
    edit_date: Date.now(),
  };

  await db.Channel.update(newChannel, { where: { channel_id } });

  res.redirect('/channel/list');
});

router.get('/delete', async function (req, res, next) {
  const channel_id = req.query.cid;

  await db.Channel.destroy({ where: { channel_id } });

  res.redirect('/channel/list');
});

module.exports = router;
