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

///////////////////////////////////////////////////////
// validate many cells in a table
// On button click
const { table1 } = components;
for (let i = 1, rows = table1.data.rows.length; i < rows; i++) {
  for (let j = 1, cols = table1.data.rows[0].length; j < cols; j++) {
    const check = didUtils.validateNum({
      input: table1.getCell(i, j).value,
      types: ["number"],
      // range: [0, 80],
      utils,
    });

    if (check.error) {
      didUtils.displayErrorMessage({ ...check, component: table1, row: i, col: j });
    }
  }
}

// on update
table1.on("change", () => {
  for (let i = 1, rows = table1.data.rows.length; i < rows; i++) {
    for (let j = 1, cols = table1.data.rows[0].length; j < cols; j++) {
      didUtils.displayErrorMessage({ display: false, component: table1, row: i, col: j });
    }
  }
});
/////////////slide 1 ////////////////////////

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

//     input: submitInput1.data.text, // others: table1.getCell(3,1).value
//     types: ["integer", "positive"], // others: "fraciton", "decimal", "number"
//     // range: array of two numbers,
//     // rangeType: string,
//     // isCloze: boolean, // is it part of an incomplete statement, equation, expression
//     // statementType: string, // "statement", "equation", "expression"
//     utils,
//   });
//   if (check.error) {
//     // see displayErrorMessage!
//     didUtils.displayErrorMessage({ ...check, component: submitInput1 }); // other component: table1, row: 3, col: 1,
//   }
// });

// submitInput1.on("change", () => {
//   didUtils.displayErrorMessage({ display: false, component: submitInput1 }); // other component: table1, row: 3, col: 1,
// });
