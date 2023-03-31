const {
  richTextEditor1, // // Determine two numbers...& studentLow/High Input
  richTextEditor4, // Cubed equation ex: $[64]<91<[125]$
} = components;

let sideCubed = 91;
let studentLowNum = "";
let studentHighNum = "";

richTextEditor1.on("change", ({ values }) => {
  updateText();
});

function updateText() {
  if (richTextEditor1.getInput(0).text === "") {
    studentLowNum = "";
  } else {
    studentLowNum = richTextEditor1.getInput(0).text;
  }
  if (richTextEditor1.getInput(1).text === "") {
    studentHighNum = "";
  } else {
    studentHighNum = richTextEditor1.getInput(1).text;
  }

  let lowIsEmpty = studentLowNum === "";
  let highIsEmpty = studentHighNum === "";

  let updatedLow = lowIsEmpty ? "" : studentLowNum ** 3;
  let updatedHigh = highIsEmpty ? "" : studentHighNum ** 3;

  richTextEditor4.updateData({
    text: `<p style="text-align: center;"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mn>${updatedLow}</mn><mo>&lt;</mo><mn>${sideCubed}</mn><mo>&lt;</mo><mn>${updatedHigh}</mn></mrow></math></p>
        `,
  });
}
