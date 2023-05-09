/* 
step=1
nextStep=(If(step==10,5,step==5,1,10))")
// paste into input bar
// Normed language:
stepText="Current movement increment is " + step + ". Press space to increment by "+ nextStep +"." 
*/

// For younger grades and/or "unit" text needed, use:
/*  stepText = "The point is set to move by " + step + If(step ≟ 1, " unit.", " units.")+" Press space to set the point to move by " + nextStep + If(nextStep ≟ 1, " unit.", " units.") */

/////////// OPTION 1 -- Uses GGB step and nextStep objects /////////////

// in GlobalJS defineKeyboardInstructions function
// function defineKeyboardInstructions(obj) {
var stepText = ggbObject.getValueString("stepText");
var arrowText = "Press the arrow keys to move this point. "; // or "Use + or - to move this point."
var compiledStepText = arrowText.concat(stepText);
var wrappedStepText = compiledStepText.replace(/(?![^\n]{1,38}$)([^\n]{1,38})\s/g, "$1\\\\");

// const keyboardInstructions = {
// A: wrappedStepText,
// }
// }

// call in clickListener
// or
// if(a==="A")
switch (a) {
  case "A": {
    ggbObject.setValue("step", ggbObject.getValue("nextStep"));
    ggbReadText("stepText", true);
    break;
  }
}

//////////// OPTION 2 -- Uses JS //////////////

var selectedObject = "";

// in defineKeyboardInstructions function
var increment = ggbObject.getValue("pointIncrement").toString();

var nextIncrement =
  ggbObject.getValue("pointIncrement") == 1
    ? "10"
    : ggbObject.getValue("pointIncrement") == 10
    ? "100"
    : ggbObject.getValue("pointIncrement") == 100
    ? "1000"
    : "1";
const keyboardInstructions = {
  A:
    "Press the arrow keys to move this point.\\\\The point's increment is " +
    increment +
    ". Press space\\\\ to change its increment to " +
    nextIncrement +
    ".",
};

// in clientFunction
switch (a.type) {
  case "select":
    selectedObject = a.target;
    switch (true) {
      case ggbObject.getObjectType(a.target) === "point":
        var increment = ggbObject.getValue("pointIncrement").toString();
        var nextIncrement =
          ggbObject.getValue("pointIncrement") == 1
            ? "10"
            : ggbObject.getValue("pointIncrement") == 10
            ? "100"
            : ggbObject.getValue("pointIncrement") == 100
            ? "1000"
            : "1";
        ggbReadText(
          "The point's increment is " +
            increment +
            ". Press space to change the point's increment to " +
            nextIncrement +
            "."
        );
        break;
    }
    break;
  case "deselect":
    selectedObject = "";
    break;
}

// in clickListener Function
switch (true) {
  case ggbObject.getObjectType(a) === "point":
    switch (ggbObject.getValue("pointIncrement")) {
      case 1:
        ggbObject.setValue("pointIncrement", 10);
        break;
      case 10:
        ggbObject.setValue("pointIncrement", 100);
        break;
      case 100:
        ggbObject.setValue("pointIncrement", 1000);
        break;
      case 1000:
        ggbObject.setValue("pointIncrement", 1);
        break;
    }

    var nextIncrement =
      ggbObject.getValue("pointIncrement") == 1
        ? "10"
        : ggbObject.getValue("pointIncrement") == 10
        ? "100"
        : ggbObject.getValue("pointIncrement") == 100
        ? "1000"
        : "1";
    ggbReadText(
      "The point's increment has been changed to " +
        ggbObject.getValue("pointIncrement") +
        ". Press space to change the increment to " +
        nextIncrement +
        "."
    );
    break;
}
