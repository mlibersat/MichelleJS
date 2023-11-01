/* Given a sequence of integers as an array, determine whether it is possible to obtain a strictly increasing sequence by removing no more than one element from the array.
ex: sequence = [1, 3, 2, 1] -> false
*/
const sequence = [1, 2, 1, 2];

function solution(sequence) {
  // make a new array by removing an element from the sequence
  let removedArray = [];
  let sortedArray = [];
  sequence.forEach(function (element, index) {
    removedArray = sequence.filter(function (keepEl, keepIn) {
      return index != keepIn;
    });
    sortedArray = sortArray([...removedArray]);
    console.log("removedArray", removedArray.toString());
    console.log("sortedArray", sortedArray.toString());
    console.log(removedArray.toString() === sortedArray.toString());
    // if (removedArray.toString() === sortedArray.toString()) {
    //   return true;
    // }
  });
  if (removedArray.toString() === sortedArray.toString()) {
    return true;
  }

  // test whether an array is sorted, return true or false
  function sortArray(array) {
    if (array.length === 1 || array.length === 0) {
      return array;
    }
    const sortedSequence = array.sort(function (a, b) {
      return a - b;
    });
    return sortedSequence;
  }
}
