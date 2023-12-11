var express = require('express');
var router = express.Router();

// 상품 목록 웹페이지 요청과 응답 라우팅 메소드
// localhost:3000/product/list
router.get('/list', async (req, res) => {
  res.render('product/list');
});

// 단일 상품 상세정보 보기 웹페이지에 대한 요청과 응답하기
// localhost:3000/product/detail?pid=1&pname=lg노트북
router.get('/detail', async (req, res) => {
  // URL에 쿼리스트링 방식으로 전달된 값 추출하기
  // URL에 쿼리스트링 방식으로 파라메터가 전달되면 req.query.[key명] 으로 키의 값을 추출할 수 있다.
  const productID = req.query.pid;
  const productName = req.query.pname;

  res.render('product/detail', { productID, productName });
});

// 호출주소: http://localhost:3000/product/detail/sample
// 호출방식: GET
router.get('/detail/sample', async (req, res) => {
  res.render('product/detail', { productID: 100, productName: '샘플노트북' });
});

// res.send() 만능 메소드를 사용해보기
router.get('/detail/sendall', async (req, res) => {
  // 문자열 데이터를 보내보자
  // res.send('<h1>안녕하세요.</h1>');

  // json데이터 보내보기
  // res.send({ uid: 'eiei', username: '나나나' });

  //   res.send(`<html>
  // <body>
  //     <h1>kkk</h1>
  //   </body></html >`);

  // 서버에 저장된 파일을 다운로드 해보자
  console.log('__dirname 물리적 경로 확인하기: ', __dirname + 'maple.jpg');
  res.sendFile(__dirname + '/maple.jpeg');
});

// 파라미터 방식으로 전달된 상품정보를 추출해 단일상품정보를 보여주기
// localhost:3000/product/detail/1
// GET
// 반환값: 단일상품정보 웹페이지
router.get('/detail/:pid', async (req, res) => {
  // URL을 통해 파라메터 방식으로 값이 전달되면
  // 주소체계내에 와일드카드 키를 설정하고 해당 키명으로 URL을 통해 전달된 파라메터 값을 추출할 수 있다.
  // 와일드 카드 이용시 주의사항: 동일한 URL 호출주소와 호출방식(GET)의 라우팅 메소드가 존재하는 경우
  // 와일드 카드 방식이 먼저 호출되고 다른 라우팅메소드 주소는 호출이 무시된다. (주의: 그렇기 때문에 동일 주소체계내에서 맨 하단에 배치해야됨)
  // (req.params.와일드카드키명)
  const productID = req.params.pid;

  res.render('product/detail', { productID, productName: '(PID)노트북' });
});

// 호출주소: http://localhost:3000/product/detail/1/LG노트북/6000
// 호출방식: GET
// 여러개의 파라메터를 여러개의 와일드카드 키명으로 정의해서 응답
router.get('/detail/:pid/:pname/:price', async (req, res) => {
  const productID = req.params.pid;
  const productName = req.params.pname;
  const productPrice = req.params.price;

  res.render('product/detail', { productID, productName, productPrice });
});

module.exports = router;
