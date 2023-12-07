// callback함수 구현 및 테스트

// 계산함수
function fnPlus(a, b) {
  const c = a + b;
  logging(c); // 이 함수의 변동이 있을시 이 위치를 바꿔야됨. 이 fnPlus 함수내용을 바꿔야 함.
  return c;
}

// 계산결과를 출력하는 함수
function logging(result) {
  console.log(`계산 결과값은 ${result}입니다.`);
}

// 계산함수 호출하기
// const result = fnPlus(10, 20);
// console.log('함수반환값:', result);

// callback함수 방식으로 기능 구현하기
// 기존 logging함수를 특정함수에 파라미터로 전달해서 해당함수내에서 전달된 함수를 실행하는 방식.. 콜백함수
function fnPlus1(a, b, callBack) {
  let c = a + b;
  callBack(c); // 함수를 매개변수로 받으니 만약 콜백함수가 변경된다 해도 이 함수는 변경할 필요가 없음
  return c;
}

// 호출하는 쪽에서 전달된 값에다 기본 배송비를 추가하여
// 로직을 변경/추가하여 변경된값을 출력.
function logging1(result) {
  const total = 3000 + result;
  console.log(`계산 결과는 배송비가 추가되어 ${total}원입니다.`);
}

const result1 = fnPlus1(1000, 2000, logging);

const result2 = fnPlus1(1000, 2000, logging1);

const result3 = fnPlus1(1000, 2000, (result) => {
  const total = 3000 + result;
  console.log(`직접 콜백함수 구현 전달: 계산 결과는 배송비가 추가되어 ${total}원입니다.`);
});

// 콜백함수를 사용하는 목적 - 비동기방식으로 처리되는 자바스크립트 프로그래밍에서
// 순차적인 절차적인(비지니스 로직)인 프로그래밍을 위해서 콜백함수를 사용함.
// 특정기능을 구현하는 함수에다 특정함수를 매개변수로 전달해서 해당 함수내의 특정 위치에서
// 전달된 콜백함수를 실행시켜 원하는 로직/절차를 순차적으로 구현되게 할 수 있다.
