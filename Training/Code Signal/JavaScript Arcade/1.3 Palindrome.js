/////////////////////// ATTEMPT 1 - USES AND PUSH/UNSHIFT ///////////////////
/* function solution(inputString) {
  // Write a new string that reverses the characters in a word (Maybe a for each.. maybe use length-i)
  const inputArr = inputString.split("");

  let newArr = [];

  for (let i = 0, L = inputArr.length; i < L; i++) {
    // Note to self: length (L) is the number of elements in the array, indexing (i) starts at 0
    const el = inputArr[i];
    newArr.push(inputArr[L - 1 - i]); //  .push pushes to end of array.  // .unshift pushes it to the end
  }

  const newStr = newArr.join("");
  // Note to self on join: ("") does not put commas, () puts commas between each
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
  // return whether or not inputString === newString
  return inputString === newStr;
}
 */
///////////////////////////// ATTEMPT 2 - USES

/* function solution(inputString) {
  // Write a new string that reverses the characters in a word (Maybe a for each.. maybe use length-i)
  const inputArr = inputString.split("");
  let newArr = [];

  for (let i = 0, L = inputArr.length; i < L; i++) {
    const el = inputArr[i];
    newArr.unshift(inputArr[i]); 
    // Note: .shift removes the first element from array. .pop removes the last element in the array => these return the thing that was removed
  }

  const newStr = newArr.join("");
  return inputString === newStr;
}
 */
/////////////////////////////////////////
////////////////////////////////////////////////
function solution(inputString) {
  const inputArr = inputString.split("");
  let newArr = [];

  inputArr.forEach(function (element) {
    newArr.unshift(element);
  });

  const newStr = newArr.join("");
  return inputString === newStr;
}
///////////////////////////////////////////
/* function solution(inputString) {
  const newString = inputString.split("").reverse().join("");

  // const inputArr = inputString.split(""); // makes an array

  // const newStr = inputArr.reverse().join(""); // reverse changes the order original array, join takes an array and returns a string

  return inputString === newString;
}
 */

////////////////////////////////////////////
/* function solution(inputString) {
  return inputString === inputString.split("").reverse().join("");
} */