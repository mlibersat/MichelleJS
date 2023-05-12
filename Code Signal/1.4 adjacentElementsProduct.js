/*  SUMMARY:
For Loop
For Each
.pop
.filter
.
*/

/////////////////////////TRIAL 4 ///////////////////////

function solution(inputArray) {
  return Math.max(...inputArray.map((el, index) => el * inputArray[index + 1]).filter((el) => !isNaN(el)));
}
/////////////////////////TRIAL 3 ///////////////////////
/* 
function solution(inputArray) {
  // ex: inputArray: [3, 6, -2, -5, 7, 3]
  // Given an array of integers, find the pair of adjacent elements that has the largest product and return that product.

  // multiply adjacent elements and push the product to a new array
  // multiply the nth element with the (n+1)st element
  const productArray = [];

  // POST fix for NaN
  // index is an optional argument
  inputArray.forEach((element, index) => {
    // for each is an array method and has to start with an array. So input.Array.length and inputArray[i] are not needed. Cool.
    productArray.push(element * inputArray[index + 1]); // can't use (element + 1) because that will add 1 to the value of the element (ex: if the element is 3, element+ 1 is 4)
  });

  // productArray.pop(); // Option 1: Pop removes the last element of the array - and mutates the array! (changes the original, does not make a new array)
  const newArray = productArray.filter((el) => !isNaN(el)); // Option 2: for funsies and learning sake, we could do this instead of pop.  Filter keeps only what we tell it to and deletes the rest. Filter array is not a mutating array method, it makes a shallow copy of the original array

  console.log(newArray);
  return Math.max(...newArray); // ... spread operator (spreads the individual elements in an array)
  // return the max value in the array
} */

/////////////////////////TRIAL 2 ///////////////////////

// function solution(inputArray) {
//   // ex: inputArray: [3, 6, -2, -5, 7, 3]
//   // Given an array of integers, find the pair of adjacent elements that has the largest product and return that product.

//   // multiply adjacent elements and push the product to a new array
//   // multiply the nth element with the (n+1)st element
//   const productArray = [];

//   // PRE - fix for NaN
//   /*   // index is an optional argument
//   inputArray.forEach((element, index) => {
//     // for each is an array method and has to start with an array. So input.Array.length and inputArray[i] are not needed. Cool.
//     productArray.push(element * inputArray[index + 1]); // can't use (element + 1) because that will add 1 to the value of the element (ex: if the element is 3, element+ 1 is 4)
//   }); */

//   // POST fix for NaN
//   // index is an optional argument
//   inputArray.forEach((element, index) => {
//     // for each is an array method and has to start with an array. So input.Array.length and inputArray[i] are not needed. Cool.
//     if (index < inputArray.length - 1) {
//       productArray.push(element * inputArray[index + 1]); // can't use (element + 1) because that will add 1 to the value of the element (ex: if the element is 3, element+ 1 is 4)
//     }
//   });

//   console.log(productArray);
//   return Math.max(...productArray); // ... spread operator (spreads the individual elements in an array)
//   // return the max value in the array
// }

////////////trial 1////////////

// function solution(inputArray) {
//   // ex: inputArray: [3, 6, -2, -5, 7, 3]
//   // Given an array of integers, find the pair of adjacent elements that has the largest product and return that product.

//   // multiply adjacent elements and push the product to a new array
//   // multiply the nth element with the (n+1)st element
//   const productArray = [];

//   for (let i = 0, L = inputArray.length - 1; i < L; i++) {
//     const element = inputArray[i];
//     productArray.push(inputArray[i] * inputArray[i + 1]);
//   }
//   console.log(productArray);
//   return Math.max(...productArray); // ... spread operator (spreads the individual elements in an array)
//   // return the max value in the array
// }
