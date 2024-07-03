/* eslint-disable no-unused-vars */
// ////////////////////////
// Test JS
function detectHere() {
  // takes a GGB object name as an argument, returns its keyboard text.
  const keyboardInstructions = {
    dropDownMenu: "Press the arrow keys to move this point.",
    O: "Use + or – to move this point.",
  };
}

function defineKeyboardInstructions(obj) {
  // takes a GGB object name as an argument, returns its keyboard text.
  const keyboardInstructions = {
    dropDownMenu:
      "Press space to open. Press up arrow and down arrow to go to different\\options. Press enter to select.",
    directQuote: "Press the arrow keys to move this point.",
    backslash: "Press the arrow keys to move\\this point.",
    extraSpace: "Press the arrow keys to move this  point.",
    symbols: "Use + or \– to move this point.",
    doNotReplace: "Press the boo arrow keys to move this point, boo.",
  };
  return keyboardInstructions[obj];
}

function detectHere2() {
  // takes a GGB object name as an argument, returns its keyboard text.
  const keyboardInstructions = {
    dropDownMenu: "Press the arrow keys to move this point.",
    noPeriod: "Use + or – to move this point",
  };
}

