const product = 36;
const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let factorPairs = [];

for (let index = 0, L = array1.length; index < L; index++) {
  const element1 = array1[index];
  for (let index = 0, L = array2.length; index < L; index++) {
    const element2 = array2[index];
    if (element1 <= element2 && element1 * element2 === product) {
      factorPairs.push(element1 + " and " + element2);
    }
  }
}
console.log(factorPairs);
factorPairs = [];
