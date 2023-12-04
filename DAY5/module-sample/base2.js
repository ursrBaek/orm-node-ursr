// base1 모듈에서 제공해주는 각종 상수와 함수를 참조한다.
// 다른 모듈/설치된 노드패키지의 기능 사용(참조)하기 위해서는 require라는 예약어를 사용.
const { odd, even, test } = require('./base1'); // 객체 비구조화 할당으로 odd, even, test를 선언


// 숫자를 매개변수(파라미터)로 받아서 해당값이 홀수인지 짝수인지 체크해서
// 홀수인지 짝수인지 문자열을 반환하는 함수.
// 모든 언어에서는 %는 좌항을 우항으로 나눈 나머지 값을 구할 때 사용
function checkOddOrEven(num) {
  // num % 2값은 0(=false) 아니면 1(=true) 반환
  if (num % 2) { // 나머지가 1이면 실행되는 구문
    return odd;
  }
  return even;
}

console.log('base2 모듈 읽었음.');

// const result = checkOddOrEven(10);
// console.log(`10은 ${result}`);

// 모듈의 기능과 속성을 외부에 제공할 때는 {}객체로도 제공 가능하고, 단일 함수 형태로도 제공 가능.
module.exports = checkOddOrEven;