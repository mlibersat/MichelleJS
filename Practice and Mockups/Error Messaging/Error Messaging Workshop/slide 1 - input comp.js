const {
  rte1,
  cc_submit_fe537b9da95e_textbox1: submitText1,
  cc_submit_fe537b9da95e_input1: submitInput1,
  cc_submit_fe537b9da95e_button1: submitButton1,
} = components;

// When the submit button is clicked, display a boilerplate error message if the numeric input is not a positive integer.

// Whenever the input is changed, be sure to clear the error message!

submitButton1.on("click", () => {
  const check = didUtils.validateNum({
    // input: input1.data.text,
    // types: ["integer"],
    // range: [0, 100],
    // utils,

    input: submitInput1.data.text,
    types: ["integer", "positive"],
    // range: array of two numbers,
    // rangeType: string,
    // isCloze: boolean,
    // statementType: string,
    utils,
  });
  if (check.error) {
    // see displayErrorMessage!
    didUtils.displayErrorMessage({ ...check, component: submitInput1 });
  }
});

submitInput1.on("change", () => {
  didUtils.displayErrorMessage({ display: false, component: submitInput1 });
});
