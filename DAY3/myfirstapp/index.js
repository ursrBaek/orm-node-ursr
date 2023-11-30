// 설치판 오픈소스 노드 패키지를 참조한다
// node.js에서는 require() 예약어를 통해 지정한 설치된 노드패키지를 참조함

// moment javascript 일자/시간 정보를 개발자가 워하는 문자 포맷으로 표현해주는 기능 제공
const moment = require('moment');
// dotenv 패키지를 참조
// dotenv 패키지는 해당 프로젝트/노드 어플리케이션의 환경설정정보에 접근해서 전역 어플리케이션 환경변수정보를 추출한다.
const env = require('dotenv');

// 프로젝트 뤁트에 있는 .env 환경설정파일에 정의된 각종 어플리케이션 환경변수를 메모리에 올림
env.config();

// 순수 자바스크립트 일시/시간 정보 출력
console.log('순수 자바스크립트 일시/시간:', Date.now());

// moment 패키지를 이용해 자바스크립트 일시정보를 출력해보자
console.log("모멘트 패키지를 통한 날짜포맷 표현하기: ", moment(Date.now()).format("YYYY-MM-DD hh:MM:ss"));

// .env 파일내 특정 환경변수정보를 추출한다.
const companyName = process.env.COMPANY_NAME;
console.log('환경변수 출력:', companyName);

// console.log("최초 노드 백엔드 자바스크립트 모듈 파일입니다.");
// console.log('로그 출력 잘된다');
// console.log('어우 배고파');