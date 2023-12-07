var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 메인 page 요청과 응답 처리 라우팅 메소드 */
// router.get메소드의 파라미터로 호출 주소와 콜백함수 전달
// router.get메소드 내부에서 콜백함수를 실행.
router.get('/main', (req, res, next) => {
  res.render('index.ejs', { title: '메인페이지' });
});

// 콜백함수가 아닌 async, await방식을 통한 router.get()메소드를 실행하는 방법
// 비동기 프로그래밍의 절차중심 기능개발시 promise 또는 async/await 방식을 사용하면
// 비동기 프로그래밍 환경에서 순차적 프로그래밍 가능함(콜백지옥 없이)
router.get('/index', async (req, res, next) => {
  res.render('index.ejs', { title: '인덱스 페이지' });
});

/**
  기능: 상품 목록 데이터에 대한 요청과 응답처리 라우팅 메서드
 */
router.get('/products', async (req, res) => {
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
      price: 6000,
      stock: 2,
    },
  ];

  // res.json()메서드는 지정한 데이터를 브라우저로 Json형태로 전달해줌.
  res.json(products);
});

module.exports = router;
