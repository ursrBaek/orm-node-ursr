// 콜백 지옥을 맛보기
// 콜백패턴의 한계 -> promise -> async/await

const fnHell = function () {
  console.log('로직1 완료');

  setTimeout(() => {
    console.log('로직2 완료');

    setTimeout(() => {
      console.log('로직3 완료');

      setTimeout(() => {
        console.log('로직4 완료');

        setTimeout(() => {
          console.log('로직5 완료');
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
};

const fnHeaven = function () {
  console.log('로직1 완료');

  setTimeout(() => {
    console.log('로직2 완료');
  }, 1000);
  setTimeout(() => {
    console.log('로직3 완료');
  }, 2000);
  setTimeout(() => {
    console.log('로직4 완료');
  }, 3000);
  setTimeout(() => {
    console.log('로직5 완료');
  }, 4000);
};

// fnHell();
fnHeaven();
