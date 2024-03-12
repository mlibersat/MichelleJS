//////////////slide 3 //////////////////////////////

// When the submit button is clicked, display a boilerplate error message for each input box where the numeric input is not a number between -11 and 11 (exclusive).

// If (and
// only
// if) the input meets the criteria, set the x-value of the corresponding point in ggb1 to be the value from the input.

// Whenever an input is changed, be sure to clear the error message attached to that input!

const { ggb1, rte1, button1 } = components;

didUtils.fakeSubmit(rte1, button1);

// When the submit button is clicked, display a boilerplate error message if the numeric input is not a positive integer.

// Whenever the input is changed, be sure to clear the error message!

button1.on("click", () => {
  const input1 = rte1.getInput(0).text;
  const input2 = rte1.getInput(1).text;

  const check1 = didUtils.validateNum({
    input: rte1.getInput(0).text,
    types: ["number"], // others: "fraciton", "decimal", "number"
    range: [-11, 11],
    rangeType: "exclusive",
    // isCloze: boolean, // is it part of an incomplete statement, equation, expression
    // statementType: string, // "statement", "equation", "expression"
    utils,
  });
  const check2 = didUtils.validateNum({
    input: rte1.getInput(1).text,
    types: ["number"], // others: "fraciton", "decimal", "number"
    range: [-11, 11],
    rangeType: "exclusive",
    // isCloze: boolean, // is it part of an incomplete statement, equation, expression
    // statementType: string, // "statement", "equation", "expression"
    utils,
  });
  if (check1.error) {
    // see displayErrorMessage!
    didUtils.displayErrorMessage({ ...check1, component: rte1, inputIndex: 0 }); // other component: table1, row: 3, col: 1,
  }
  if (check2.error) {
    // see displayErrorMessage!
    didUtils.displayErrorMessage({ ...check2, component: rte1, inputIndex: 1 }); // other component: table1, row: 3, col: 1,
  }

  if (!check1.error && !check2.error) {
    ggb1.instance.setCoords("A", input1, 0);
    ggb1.instance.setCoords("B", input2, 0);
  }
});

rte1.on("change", () => {
  didUtils.displayErrorMessage({ display: false, component: rte1, inputIndex: 0 }); // other component: table1, row: 3, col: 1,
  didUtils.displayErrorMessage({ display: false, component: rte1, inputIndex: 1 }); // other component: table1, row: 3, col: 1,
});

/////////////////// slide 2 /////////////////////////////

// When the submit button is clicked, display a boilerplate error message if the numeric input from the editable cell is not an integer between 0 and 11 (inclusive).

// Whenever the input is changed, be sure to clear the error message!

// Note: there is a bug with error messages in tables at the moment; if the error message doesn't update when it should, mouse over or click into the cell, which should prompt an update.

// const { rte1, table1, button1 } = components;
// didUtils.fakeSubmit(table1, button1);

// button1.on("click", () => {
//   const check = didUtils.validateNum({
//     input: table1.getCell(3, 1).value,
//     types: ["integer"],
//     range: [0, 11],
//     utils,
//   });
//   if (check.error) {
//     //     // see displayErrorMessage!
//     didUtils.displayErrorMessage({ ...check, component: table1, row: 3, col: 1 });
//   }
// });

// table1.on("change", () => {
//   didUtils.displayErrorMessage({ display: false, component: table1, row: 3, col: 1 });
// });

/////////////slide 1  & notes ////////////////////////

// const {
//   rte1,
//   cc_submit_fe537b9da95e_textbox1: submitText1,
//   cc_submit_fe537b9da95e_input1: submitInput1,
//   cc_submit_fe537b9da95e_button1: submitButton1,
// } = components;

// // When the submit button is clicked, display a boilerplate error message if the numeric input is not a positive integer.

// // Whenever the input is changed, be sure to clear the error message!

// submitButton1.on("click", () => {
//   const check = didUtils.validateNum({
//     // input: input1.data.text,
//     // types: ["integer],
//     // range: [0, 100],
//     // utils,

//     input: submitInput1.data.text, // others: table1.getCell(3,1).value   rte1.getInput(0).text,
//     types: ["integer", "positive"], // others: "fraciton", "decimal", "number"
//     // range: array of two numbers,
//     // rangeType: string, // ex: "exclusive" (inclusive is default)
//     // isCloze: boolean, // is it part of an incomplete statement, equation, expression
//     // statementType: string, // "statement", "equation", "expression"
//     utils,
//   });
//   if (check.error) {
//     // see displayErrorMessage!
//     didUtils.displayErrorMessage({ ...check, component: submitInput1 }); // other component: table1, row: 3, col: 1,     rte1, inputIndex: 0
//   }
// });

// submitInput1.on("change", () => {
//   didUtils.displayErrorMessage({ display: false, component: submitInput1 }); // other component: table1, row: 3, col: 1,       rte1, inputIndex: 0
// });
