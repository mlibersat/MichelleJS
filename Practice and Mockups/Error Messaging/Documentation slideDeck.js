const { richTextEditor1, button1, table1 } = components;

// Need to update this to on click of button
richTextEditor1.on("change", ({ values /* we need to send values */ }) => {
  console.log(values);
  console.log(values[0].text);

  console.log("Number.isInteger(600)", Number.isInteger(600));
  console.log("Number.isInteger(values[0].text)", Number.isInteger(values[0].text));
  console.log("Number.isInteger(values[0])", Number.isInteger(values[0]));
  const input = values[0].text;

  // check if number is an integer
  if (!Number.isInteger(+input)) {
    richTextEditor1.showErrorMessage({
      value: values[0],
      data: { id: 1, title: "", message: "Enter an integer." },
    });
  } else if (values[0].text < 0 || values[0].text > 1000) {
    richTextEditor1.showErrorMessage({
      value: values[0],
      data: { id: 1, title: "", message: "Enter an integer between 0 and 1000." },
    });
  } else {
    richTextEditor1.hideErrorMessage({ value: values[0], messageId: 1 });
  }

  // if (values[0].text != 867) {
  //   richTextEditor1.showErrorMessage({
  //     value: values[0],
  //     data: { id: 1, title: "Invalid input", message: "Enter three digit exchange" },
  //   });
  // } else {
  //   richTextEditor1.hideErrorMessage({ value: values[0], messageId: 1 });
  // }
  // if (Math.floor(values[1].text / 1000) < 1) {
  //   richTextEditor1.showErrorMessage({
  //     value: values[1],
  //     data: { id: 2, title: "Invalid input", message: "Enter four digit number" },
  //   });
  // } else {
  //   richTextEditor1.hideErrorMessage({ value: values[1], messageId: 2 });
  // }
  // if (values[1].text != 5309) {
  //   richTextEditor1.showErrorMessage({
  //     value: values[1],
  //     data: { id: 3, title: "Invalid input", message: "Enter correct number" },
  //   });
  // } else {
  //   richTextEditor1.hideErrorMessage({ value: values[1], messageId: 3 });
  // }
});

// button1.on("click", () => {
//   let answer = textInput1.data.text;
//   if (answer !== "snowman") {
//     textInput1.showErrorMessage({ id: 1, title: "Answer not valid", message: "think cold anthropomorphic figure" });
//   } else {
//     textInput1.hideErrorMessage({ messageId: 1 });
//   }
//   let number = textInput2.data.text;
//   console.log(number);
//   if (number != 8) {
//     textInput2.showErrorMessage({
//       id: 1,
//       title: "Answer not valid",
//       message: "tick tock tick tock tick tock tick tock",
//     });
//   } else {
//     textInput2.hideErrorMessage({ messageId: 1 });
//   }
// });

// table1.showErrorMessage({
//   row: 0,
//   col: 0,
//   id: 0,
//   title: "Ha ha",
//   message: "nothing you do can fix this error",
// });
