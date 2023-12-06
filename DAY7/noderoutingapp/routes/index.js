// routes-index.js 샘플 웹사이트의 공통 사용자 요청과 응답을 처리해주는 라우팅 파일

// express 웹개발 프레임워크 패키지 참조하기
var express = require('express');

// express 객체의 router()메서드를 호출해서 router 객체를 생성한다.
// router객체는 모든 사용자의 요청과 응답을 처리하는 핵심 객체임.
var router = express.Router();


// 신규페이지 메인
router.get('/main', function (req, res) {
  res.render('main');
})

/*
  샘플 노드 익스프레스 웹사이트의 메인 웹페이지 요청과 응답처리 라우팅 메소드
  호출 주소 체계 -> http://localhost:3000/
  router.get()메소드는 클라이언트에서 직접 url을 입력해서 최초 호출하거나
  각종 링크주소를 클릭했을 때 발생함.
  사용자가 url을 통해 서버에 무언가를 요청할 때 get, post, put, delete ... 등의 요청 메소드를 사용.
  - get: 리소스 획득, 존재하는 특정 리소스의 표시를 요청하는데, 오직 데이터를 받는 기능

  - router.get('사용자가 호출하는 주소', 호출된 주소에서 처리해야할 응답처리를 위한 콜백함수);
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 회사소개 웹페이지 요청과 응답처리 라우팅 메소드
// step1: 라우팅 메소드의 기본 호출주소체계를 정의한다.
// http://localhost:3000/intro
// http://localhost:3000/company
// step2: 응답처리를 할 함수 정의. (동일한 주소체계로 요청이 들어오면 어떤 처리를 할지를 정의)
router.get('/company', function (req, res) {
  // req -> HttpRequest 객체임. 
  // 웹브라우저 또는 클라이언트에서 서버로 넘어오는 http 요청에 대한 각종 정보가 담겨있음.
  // req에 담긴 정보를 추출할 수 있음

  // res -> HttpResponse 객체임.
  // 웹서버에서 웹브라우저 또는 클라이언트로 응답을 처리해주는 객체
  // 주로 res를 이용해 서버상의 웹페이지(view), 데이터(json데이터)등을 전달.
  
  // res.render('views폴더 내의 특정 뷰 파일', 뷰에 전달할 데이터)메소드는 
  // views폴더내에 있는 지정한 view파일(.ejs)내의 html내용을 웹브라우저로 전송.
  res.render('company.ejs', {
    companyName: '네이버',
    ceo: '백나라'
  });
});

// 회사 연락처 정보 제공 웹페이지 요청과 응답 처리 라우팅 메소드
// http://localhost:3000/contact
// 사용자 요청은 주소체계(주소)와 요청방식(get, post..)이 일치하는 라우팅 메소드를 찾아서 
// 해당 메소드의 콜백함수가 실행되어 응답이 전달됨.
router.get('/contact', function (req, res) {
  
  res.render('sample/contact', {
    email: 'nara@gmail.com',
    tel: "010-123-1231",
    addr: '대전광역시 대덕구 송촌동'
  })
});

// 회사 제품소개 웹페이지 요청과 응답 처리 라우팅 메소드
// http://localhost:3000/products/computer
router.get('/products/computer', function (req, res) {

  const computer = {
    brand: 'SAMSUNG',
    productName: '삼성 갤럭시북2',
    price: '1,700,000원',
    image: 'data:image/jpeg;base64,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',
  };
  
  res.render('product/computer.ejs', {computer});
});

// 회사 대표 인삿말 웹페이지 요청과 응답처리 라우팅 메소드
// 호출주소: http://localhost:3000/welcome
// 호출방식: get방식으로 사용자가 요청해오면 router.get()메소드로 수신해줘야 함.
// 반환형식: 웹페이지 or 웹페이지 + 데이터 or 데이터(restful서비스)
router.get('/welcome', function (req, res) {
  
  res.render('welcome.ejs');
});


// 반드시 라우터 파일에서는 해당 라우터 객체를 외부로 exports를 통해 노출해줘야 함.
module.exports = router;
