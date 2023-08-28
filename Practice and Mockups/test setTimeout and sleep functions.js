let a = 0;

trial1();

// setTimeout(function () {
//   trial1();
// }, 1000);

// function trial1() {
//   setTimeout(function () {
//     console.log("a", a);
//     a++;
//   }, 1000);
// }

function trial1() {
  setTimeout(function () {
    console.log("a0", a);
    a++;
    setTimeout(function () {
      console.log("a1", a);
      a++;
      setTimeout(function () {
        console.log("a2", a);
        a++;
      }, 1000);
    }, 1000);
  }, 1000);
}

// function trial1() {
//   setTimeout(function () {
//     console.log("a", a);
//     a++;
//   }, 1000);
//   setTimeout(function () {
//     console.log("a", a);
//     a++;
//   }, 2000);
//   setTimeout(function () {
//     console.log("a", a);
//     a++;
//   }, 3000);
// }
