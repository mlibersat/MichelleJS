const {
  text1, // Determine two numbers
  fib1, // StudentLow/High Input
  text2, // Cubed equation ex: $[64]<91<[125]$
} = components;

let sideCubed = 91;
let studentLowNum = "";
let studentHighNum = "";

// fib1.updateData({ align: "center" });

fib1.on("change", ({ values }) => {
  updateText();
});

function updateText() {
  if (fib1.getInput(0).text === "") {
    studentLowNum = "";
  } else {
    studentLowNum = fib1.getInput(0).text;
  }
  if (fib1.getInput(1).text === "") {
    studentHighNum = "";
  } else {
    studentHighNum = fib1.getInput(1).text;
  }

  let lowIsEmpty = studentLowNum === "";
  let highIsEmpty = studentHighNum === "";

  let updatedLow = lowIsEmpty ? "" : studentLowNum ** 3;
  let updatedHigh = highIsEmpty ? "" : studentHighNum ** 3;

  text2.updateData({
    text: `$${updatedLow}<${sideCubed}<${updatedHigh}$`,
  });
}
