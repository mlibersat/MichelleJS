registerSafeObjectUpdateListener("number", quickChange);
registerSafeObjectUpdateListener("number2", quickChange);

function quickChange() {
  // Used to check if the value has changed
  const newNum = ggbObject.getValue("number");
  const newNum2 = ggbObject.getValue("number2");

  // Reset the applet only if the student changes one of the input values
  if (newNum !== oldNum || newNum2 !== oldNum2) {
    reset();
    oldNum = newNum;
    oldNum2 = newNum2;
  }
  // Place all code that should run on change of inputs above here.
}

function reset() {
  // run code to reset the interactive
}
