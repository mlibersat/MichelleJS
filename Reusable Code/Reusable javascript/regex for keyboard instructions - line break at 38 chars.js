const someText = "Insert text string here; make it long so you can see the line break at 88 characters.";

// 88 for KI, use 38 for instructionsText
const newText = someText.replace(/(?![^\n]{1,38}$)([^\n]{1,88})\s/g, "$1\\\\");
console.log(newText)
