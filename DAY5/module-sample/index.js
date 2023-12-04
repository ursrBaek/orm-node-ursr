const { odd, even } = require('./base1.js');
const checkOddOrEven = require('./base2.js');

// 문자열의 길이가 홀수인지 짝수인지를 문자열로 반환하는 함수.
function checkStringOddOrEven(str) {
  if (str.length % 2) {
    return odd; // 홀수입니다.
  }
  return even; // 짝수입니다.
}

console.log('숫자에 대해 홀짝 여부를 판단해보자.', checkOddOrEven(5));
console.log('문자열 길이가 홀수인지 짝수인지 판단해보자.', checkStringOddOrEven('안녕하세요'));
