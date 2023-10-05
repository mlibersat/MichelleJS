// Extract a number from a string
const findNum = /\d+/g;
// Option 2: const findNum =  /[0-9]/g
const string = "5Trapezoid21";
// Option 1: take out all numbers from the strin
const alphaString = string.replace(findNum, ""); // Output "Trapezoid"

// Option 2: make an array with strings of the numerals found in the original string
const numArray = string.match(findNum); // Output: ["5","21"]
