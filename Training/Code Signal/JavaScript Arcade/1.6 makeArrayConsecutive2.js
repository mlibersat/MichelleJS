// Idea:
// function solution(statues) {
// Ex: For statues = [6, 2, 3, 8], the output should be solution(statues) = 3 because the needed statues are 4, 5, and 7
// Create a new array that has all the integers from the min to the max
// min = (Math.min(...array)) to max = (Math.max(...array))
// (Method 1) take out any duplicate integers in statues (this step could possibly be skipped because none of the tests have duplicate elements) & subtract the lengths of the arrays
// (Method 2) filter out any elements in the new array that are not part of statues array, and take its length
// (Method 3) maybe use sort, and do ???
//}

// Attempt 1 - didn't actually do Method 1
// function solution(statues) {
//   // Ex: For statues = [6, 2, 3, 8], the output should be solution(statues) = 3 because the needed statues are 4, 5, and 7
//   // Create a new array that has all the integers from the min to the max
//   // min = (Math.min(...array)) to max = (Math.max(...array))
//   // (Method 1) take out any duplicate integers in statues (this step could possibly be skipped because none of the tests have duplicate elements) & subtract the lengths of the arrays
//   // (Method 2) filter out any elements in the new array that are not part of statues array, and take its length
//   // (Method 3) maybe use sort, and do ???
//   const min = Math.min(...statues);
//   const max = Math.max(...statues);
//   console.log("min %o,  max %o", min, max);
//   // const minMax = [];
//   const lengthMinMax = max - min; // Ex: 8 - 2 = 6
//   console.log(lengthMinMax + 1 - statues.length);
//   return lengthMinMax + 1 - statues.length;
// }

// // Attempt 2 - Attempt 2, but more succinct/squishy
// function solution(statues) {
//   // const min = Math.min(...statues);
//   // const max = Math.max(...statues);
//   // console.log("min %o,  max %o", min, max);
//   // // const minMax = [];
//   // const lengthMinMax = max - min; // Ex: 8 - 2 = 6
//   console.log(Math.max(...statues) - Math.min(...statues) + 1 - statues.length);
//   return Math.max(...statues) - Math.min(...statues) + 1 - statues.length;
// }

// Attempt 3 - but actually doing Method 1
function solution(statues) {
  // statues = [6, 2, 8, 6, 8, 10];
  // Ex: For statues = [6, 2, 3, 8], the output should be solution(statues) = 3 because the needed statues are 4, 5, and 7
  // Create a new array that has all the integers from the min to the max
  // min = (Math.min(...array)) to max = (Math.max(...array))
  // (Method 1) take out any duplicate integers in statues (this step could possibly be skipped because none of the tests have duplicate elements) & subtract the lengths of the arrays
  // (Method 2) filter out any elements in the new array that are not part of statues array, and take its length
  // (Method 3) maybe use sort, and do ???
  const min = Math.min(...statues);
  const max = Math.max(...statues);
  console.log("min %o,  max %o", min, max);
  const minMax = [];
  // for (let i = min, L = max + 1; i < L; i++) {
  //   // const element = array[i];
  //   minMax.push(i);
  // }
  for (let i = 0, L = max - min + 1; i < L; i++) {
    // const element = array[i];
    minMax.push(i + min);
  }
  console.log(minMax);

  const statuesUnique = new Set();
  statues.forEach(function (element) {
    // if (statues.includes(element)) {
    statuesUnique.add(element); // .add for a set is like .push for an array
    // }
  });
  // const statuesUnique = [];
  // statues.forEach(function (element) {
  //   if (statues.includes(element)) {
  //     statuesUnique.push(element);
  //   }
  // });
  console.log(statuesUnique);

  return minMax.length - statuesUnique.size; // .size for a set is like .length for an array
  // return minMax.length - statuesUnique.length;
}
