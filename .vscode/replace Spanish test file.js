/* eslint-disable no-unused-vars */
// ////////////////////////
// Test JS
function doNotDetectHere() {
  // takes a GGB object name as an argument, returns its keyboard text.
  const keyboardInstructions = {
    dropDownMenu: "Press the arrow keys to move this point.",
    O: "Use + or – to move this point",
  };
}

function defineKeyboardInstructions(obj) {
  // takes a GGB object name as an argument, returns its keyboard text.
  const keyboardInstructions = {
    dropDownMenu:
      "Press space to open. Press up arrow and down arrow to go to different options. Press enter to select.",
    O: "Press the arrow keys to move this point.",
    P1lil: "Press the arrow keys to move this point.",
    P2lil: "Press the arrow keys to move this point.",
    P3lil: "Use + or – to move this point",
  };
  return keyboardInstructions[obj];
}

function doNotDetectHere2() {
  // takes a GGB object name as an argument, returns its keyboard text.
  const keyboardInstructions = {
    dropDownMenu: "Press the arrow keys to move this point.",
    O: "Use + or – to move this point",
  };
}
