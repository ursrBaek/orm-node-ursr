var express = require('express');
var router = express.Router(); /**


/**
  기능: 상품 목록 데이터에 대한 요청과 응답처리 라우팅 메서드
 */
router.get('/list', async (req, res) => {
  const products = [
    {
      pid: 1,
      pname: 'LG 노트북',
      price: 5000,
      stock: 4,
    },
    {
      pid: 2,
      pname: 'SAMSUNG 노트북',
      price: 7000,
      stock: 2,
    },
  ];

  // res.json()메서드는 지정한 데이터를 브라우저로 Json형태로 전달해줌.
  res.json(products);
});

module.exports = router;
