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
const re2 = "5Trapezoid21"
const regex2 = /\d+/g
console.log(re2
.match(regex2)) // ['5', '21']
console.log(re2
.search(regex2)) // 0
console.log(re2
.replace(re2
.replace(regex2, ""),"")) // 521


// Example2: 
const re = "56Trapezoid21"
const regex = /\d+/g
console.log(re.match(regex)) // ['56', '21']
console.log(re.match(regex)[0]) // '56'
console.log(re.search(regex)) // 0

console.log(re.replace(re.replace(regex, ""), "")) // 5621
////////////////////////////////////////////////////////////////////////////////////////

// Find and Replave in VSCode

/* 
Find and Replace “firstload"

Right-click on the lesson folder in VSCode.

Type slide.on\("firstload", ([\s\S\n]*?;\n*\})\); in the “Find” field.

Choose the RegEx icon at the end of the “Find” field.

Type const { onInit } = didUtils.cD({ components })\n\nonInit($1); in the “Replace” field. 

If necessary, reveal the “Replace” field using the drop down arrow to the left of the “Find” field. 

Ex Before:
slide.on("firstload", () => {
  didUtils.disappear(text2, select2, text3);
});

Ex After:
const { onInit } = didUtils.cD({ components });

onInit(() => {
  didUtils.disappear(rte2, select2, rte3);
});
*/

