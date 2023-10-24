// Extract a number from a string
const findNum = /\d+/g;
// Option 2: const findNum =  /[0-9]/g
const string = "5Trapezoid21";
// Option 1: take out all numbers from the strin
const alphaString = string.replace(findNum, ""); // Output "Trapezoid"
// Alternatively, return the first string of numbers in the strong
const alphaString2 = string.replace(string.replace(findNum, ""),""); // Output "5"

// Option 2: make an array with strings of the numerals found in the original string
// The match() method returns an array of matches. The search() method returns the position (index) of the first match.
const numArray = string.match(findNum); // Output: ["5","21"]
const numArray2 = string.search(findNum); // Output: 0



// Examples: 
const re = "5Trapezoid21"
const regex = /\d+/g
console.log(re.match(regex)) // ['5', '21']
console.log(re.search(regex)) // 0
console.log(re.replace(re.replace(regex, ""),"")) // 521


// Example2: 
const re = "56Trapezoid21"
const regex = /\d+/g
console.log(re.match(regex)) // ['56', '21']
console.log(re.match(regex)[0]) // '56'
console.log(re.search(regex)) // 0
console.log(re.replace(re.replace(regex, ""),"")) // 5621
