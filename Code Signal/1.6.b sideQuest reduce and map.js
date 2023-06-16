// Reduce takes an array and spits back a single value/thing (bag of oranges -> orange juice)
// const array1 = [1, 2, 3, 4];
const array1 = ["'Hi,", " Michelle", "!'"];

// 0 + 1 + 2 + 3 + 4
const initialValue = "Levi says, ";
const sumWithInitial = array1.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);

console.log(sumWithInitial);
// Expected output: 10

let myVal = 5;
// myVal = myVal + 8; // 13
myVal += 8; // += is a short hand way to reassign a value to a variable by adding something to it
// myVal++
// myVal = myVal + 1

// similar to how myVal++ adds 1 to myVal
console.log(myVal); // 13

//////////////////////////////////////////////////////
// Map takes an array and spits out a new array based on your function (think of dilation maps a set of points to a new set of points or a function machine)

const array2 = [1, 4, 9, 16];

// Pass a function to map
const map1 = array2.map((x) => x * 2);

console.log(map1);
// Expected output: Array [2, 8, 18, 32]

/////////////////////////////////////////////////////
// Array is a JS class (cap letter signifies a class)
// const myArray = [1, 2, 3];

const myArray = Array(1, 2, 3); // Array takes arguments and makes an array from it

console.log(myArray);

////////////////////////////////////////////////////
// Array.from creates an array from an array-like object
// creates a new shallow copy
